import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

export async function POST(_req: Request, ctx: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.name) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const role = (session.user as any).role as string | undefined
  if (role !== "ADMIN") {
    return NextResponse.json({ error: "Solo ADMIN" }, { status: 403 })
  }

  const id = ctx.params.id
  const by = session.user.name

  const updated = await prisma.$transaction(async (tx) => {
    const order = await tx.order.findFirst({
      where: { id, deletedAt: null },
      include: { items: true },
    })
    if (!order) throw new Error("Pedido no existe")
    if (order.status === "ENTREGADO") throw new Error("Ya está entregado")

    // Validar stock
    for (const it of order.items) {
      const p = await tx.product.findUnique({ where: { id: it.productId } })
      if (!p) throw new Error(`Producto no existe: ${it.productId}`)
      if (p.stock < it.qty) throw new Error(`Sin stock suficiente: ${p.id} (stock ${p.stock}, requiere ${it.qty})`)
    }

    // Descontar
    for (const it of order.items) {
      await tx.product.update({
        where: { id: it.productId },
        data: { stock: { decrement: it.qty } },
      })
    }

    const out = await tx.order.update({
      where: { id },
      data: {
        status: "ENTREGADO",
        deliveredAt: new Date(),
        deliveredBy: by,
        updatedBy: by,
        audits: { create: { action: "DELIVER", byUser: by, note: "Pedido entregado (stock descontado)" } },
      },
      select: { id: true, status: true },
    })

    return out
  })

  return NextResponse.json(updated)
}
