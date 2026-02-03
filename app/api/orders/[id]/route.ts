import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export const runtime = "nodejs"

type UpdateOrderBody = {
  customerName?: string
  items?: Array<{
    productId: string
    name: string
    unitPrice: number
    qty: number
    unit?: string
  }>
}

export async function GET(_: Request, ctx: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

  const order = await prisma.order.findFirst({
    where: { id: ctx.params.id, deletedAt: null },
    include: { items: true },
  })

  if (!order) return NextResponse.json({ error: "No existe" }, { status: 404 })
  return NextResponse.json(order)
}

export async function PUT(req: Request, ctx: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

  const role = (session.user as any).role as string | undefined
  if (role !== "VENDEDOR" && role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const userName = session.user.name ?? "Usuario"
  const body = (await req.json()) as UpdateOrderBody

  const updated = await prisma.$transaction(async (tx) => {
    const order = await tx.order.findFirst({
      where: { id: ctx.params.id, deletedAt: null },
      include: { items: true },
    })
    if (!order) throw new Error("NO_EXISTE")

    // Reemplazo total de items (simple y estable)
    if (body.items) {
      await tx.orderItem.deleteMany({ where: { orderId: order.id } })
      await tx.orderItem.createMany({
        data: body.items.map((it) => ({
          orderId: order.id,
          productId: it.productId,
          name: it.name,
          unitPrice: it.unitPrice,
          qty: it.qty,
          unit: it.unit ?? "PZ",
        })),
      })
    }

    const upd = await tx.order.update({
      where: { id: order.id },
      data: {
        customerName: body.customerName?.trim() ?? order.customerName,
        updatedBy: userName,
        audits: { create: { action: "EDIT", byUser: userName } },
      },
      include: { items: true },
    })

    return upd
  }).catch((e) => {
    if (String(e?.message).includes("NO_EXISTE")) {
      return null
    }
    throw e
  })

  if (!updated) return NextResponse.json({ error: "No existe" }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(_: Request, ctx: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

  const role = (session.user as any).role as string | undefined
  if (role !== "ADMIN") return NextResponse.json({ error: "Solo ADMIN" }, { status: 403 })

  const userName = session.user.name ?? "Usuario"

  const order = await prisma.order.findFirst({ where: { id: ctx.params.id, deletedAt: null } })
  if (!order) return NextResponse.json({ error: "No existe" }, { status: 404 })

  await prisma.order.update({
    where: { id: order.id },
    data: {
      deletedAt: new Date(),
      updatedBy: userName,
      audits: { create: { action: "DELETE", byUser: userName } },
    },
  })

  return NextResponse.json({ ok: true })
}
