import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export const runtime = "nodejs"

type Body = {
  deliveredAt: string
  deliveredPlace: string
}

// ✅ Next: params puede venir como Promise
type Ctx = { params: Promise<{ id: string }> }

export async function PATCH(req: Request, { params }: Ctx) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const byUser = session.user.email ?? session.user.name ?? "ADMIN"

  // ✅ ESTE es el fix
  const { id: raw } = await params
  if (!raw) return NextResponse.json({ error: "Falta id" }, { status: 400 })

  const body = (await req.json().catch(() => null)) as Body | null
  if (!body?.deliveredAt || !body?.deliveredPlace?.trim()) {
    return NextResponse.json({ error: "Falta deliveredAt o deliveredPlace" }, { status: 400 })
  }

  const deliveredAt = new Date(body.deliveredAt)
  if (isNaN(deliveredAt.getTime())) {
    return NextResponse.json({ error: "deliveredAt inválido" }, { status: 400 })
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findFirst({
        where: { OR: [{ id: raw }, { folio: raw }] },
        include: { items: true },
      })

      if (!order || order.deletedAt) throw new Error("Pedido no encontrado")

      if (order.status === "ENTREGADO") {
        return { order, alreadyDelivered: true }
      }

      for (const it of order.items) {
        const p = await tx.product.findUnique({ where: { id: it.productId } })
        if (!p) throw new Error(`Producto no encontrado: ${it.productId}`)
        if (p.stock < it.qty) throw new Error(`Stock insuficiente: ${p.name} (stock ${p.stock}, requiere ${it.qty})`)
      }

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
          deliveredAt,
          deliveredPlace: body.deliveredPlace.trim(),
          deliveredBy: byUser,
          updatedBy: byUser,
        },
      })

      await tx.orderAudit.create({
        data: {
          orderId: order.id,
          action: "DELIVERED",
          byUser,
          note: `Lugar: ${body.deliveredPlace.trim()}`,
        },
      })

      return { order: updated, alreadyDelivered: false }
    })

    return NextResponse.json(result)
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Error" }, { status: 400 })
  }
}
