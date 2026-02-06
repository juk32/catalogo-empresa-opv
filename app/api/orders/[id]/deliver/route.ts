import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export const runtime = "nodejs"

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const role = (session.user as any).role as string | undefined
  if (role !== "ADMIN") {
    return NextResponse.json({ error: "Solo ADMIN" }, { status: 403 })
  }

  const userName = session.user.name ?? "Admin"

  const { id } = await ctx.params
  if (!id) {
    return NextResponse.json({ error: "Falta id" }, { status: 400 })
  }

  const result = await prisma
    .$transaction(async (tx) => {
      const order = await tx.order.findFirst({
        where: { id, deletedAt: null },
        include: { items: true },
      })

      if (!order) throw new Error("NO_EXISTE")
      if (order.status === "ENTREGADO") return order

      // descontar stock
      for (const it of order.items) {
        await tx.product.update({
          where: { id: it.productId },
          data: { stock: { decrement: it.qty } },
        })
      }

      const updated = await tx.order.update({
        where: { id: order.id },
        data: {
          status: "ENTREGADO",
          deliveredAt: new Date(),
          deliveredBy: userName,
          updatedBy: userName,
          audits: {
            create: { action: "DELIVER", byUser: userName },
          },
        },
        include: { items: true },
      })

      return updated
    })
    .catch((e) => {
      if (String(e?.message).includes("NO_EXISTE")) return null
      throw e
    })

  if (!result) {
    return NextResponse.json({ error: "No existe" }, { status: 404 })
  }

  return NextResponse.json(result)
}
