import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export const runtime = "nodejs"

function isAdmin(session: any) {
  const role = session?.user && (session.user as any).role
  return role === "ADMIN"
}

// GET /api/orders/[id]
export async function GET(_req: Request, ctx: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const id = ctx.params.id
  if (!id) return NextResponse.json({ error: "Falta id" }, { status: 400 })

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, audits: true },
  })

  if (!order || order.deletedAt) {
    return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 })
  }

  return NextResponse.json(order)
}

type PatchBody = {
  customerName?: string
  deliveryAt?: string | null
  items?: Array<{ id?: string; qty?: number }>
}

// PATCH /api/orders/[id]
export async function PATCH(req: Request, ctx: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }
  if (!isAdmin(session)) {
    return NextResponse.json({ error: "Solo ADMIN" }, { status: 403 })
  }

  const id = ctx.params.id
  if (!id) return NextResponse.json({ error: "Falta id" }, { status: 400 })

  const body = (await req.json().catch(() => ({}))) as PatchBody
  const updatedBy = (session.user as any)?.name || (session.user as any)?.email || "ADMIN"

  // validar deliveryAt
  let deliveryAtDate: Date | null | undefined = undefined
  if (body.deliveryAt === null) deliveryAtDate = null
  if (typeof body.deliveryAt === "string" && body.deliveryAt) {
    const d = new Date(body.deliveryAt)
    if (isNaN(d.getTime())) {
      return NextResponse.json({ error: "deliveryAt inválido" }, { status: 400 })
    }
    deliveryAtDate = d
  }

  // transacción para actualizar pedido + qty items + audit
  const result = await prisma.$transaction(async (tx) => {
    const current = await tx.order.findUnique({
      where: { id },
      include: { items: true },
    })

    if (!current || current.deletedAt) {
      throw new Error("Pedido no encontrado")
    }

    // 1) update del pedido (solo campos permitidos)
    await tx.order.update({
      where: { id },
      data: {
        customerName: typeof body.customerName === "string" ? body.customerName : undefined,
        deliveryAt: deliveryAtDate,
        updatedBy,
      },
    })

    // 2) update solo qty (no name, no unitPrice)
    if (Array.isArray(body.items) && body.items.length > 0) {
      for (const it of body.items) {
        if (!it?.id) continue
        const qty = Number(it.qty)
        if (!Number.isFinite(qty) || qty < 1) continue

        await tx.orderItem.update({
          where: { id: it.id },
          data: { qty },
        })
      }
    }

    // 3) audit
    await tx.orderAudit.create({
      data: {
        orderId: id,
        action: "EDIT",
        byUser: updatedBy,
        note: "Editó cliente/horario/qty (name y unitPrice bloqueados)",
      },
    })

    return tx.order.findUnique({
      where: { id },
      include: { items: true, audits: true },
    })
  })

  return NextResponse.json(result)
}

// DELETE /api/orders/[id] (borrado lógico)
export async function DELETE(_req: Request, ctx: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }
  if (!isAdmin(session)) {
    return NextResponse.json({ error: "Solo ADMIN" }, { status: 403 })
  }

  const id = ctx.params.id
  if (!id) return NextResponse.json({ error: "Falta id" }, { status: 400 })

  const by = (session.user as any)?.name || (session.user as any)?.email || "ADMIN"

  const order = await prisma.order.findUnique({ where: { id } })
  if (!order || order.deletedAt) {
    return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 })
  }

  await prisma.$transaction([
    prisma.order.update({
      where: { id },
      data: { deletedAt: new Date(), updatedBy: by },
    }),
    prisma.orderAudit.create({
      data: {
        orderId: id,
        action: "DELETE",
        byUser: by,
        note: "Borrado lógico",
      },
    }),
  ])

  return NextResponse.json({ ok: true })
}
