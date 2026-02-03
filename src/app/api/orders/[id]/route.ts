import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

type EditBody = {
  customerName?: string
  items?: Array<{
    productId: string
    name: string
    unitPrice: number
    qty: number
    unit?: string
  }>
}

export const runtime = "nodejs"

export async function GET(_req: Request, ctx: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.name) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

  const id = ctx.params.id
  const order = await prisma.order.findFirst({
    where: { id, deletedAt: null },
    include: { items: true },
  })
  if (!order) return NextResponse.json({ error: "No existe" }, { status: 404 })

  return NextResponse.json(order)
}

export async function PUT(req: Request, ctx: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.name) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

  const role = (session.user as any).role as string | undefined
  if (role !== "VENDEDOR" && role !== "ADMIN") return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  const id = ctx.params.id
  const by = session.user.name
  const body = (await req.json()) as EditBody

  const updated = await prisma.$transaction(async (tx) => {
    const current = await tx.order.findFirst({ where: { id, deletedAt: null }, include: { items: true } })
    if (!current) throw new Error("No existe")
    if (current.status === "ENTREGADO") throw new Error("No se puede editar un pedido ENTREGADO")

    // Si mandan items, los reemplazamos completo (simple y robusto)
    if (body.items) {
      await tx.orderItem.deleteMany({ where: { orderId: id } })
      await tx.orderItem.createMany({
        data: body.items.map((it) => ({
          orderId: id,
          productId: it.productId,
          name: it.name,
          unitPrice: it.unitPrice,
          qty: Math.trunc(it.qty),
          unit: it.unit ?? "PZ",
        })),
      })
    }

    const out = await tx.order.update({
      where: { id },
      data: {
        customerName: body.customerName?.trim() || undefined,
        updatedBy: by,
        audits: { create: { action: "EDIT", byUser: by, note: "Pedido editado" } },
      },
      select: { id: true, folio: true },
    })

    return out
  })

  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, ctx: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.name) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

  const role = (session.user as any).role as string | undefined
  if (role !== "ADMIN") return NextResponse.json({ error: "Solo ADMIN" }, { status: 403 })

  const id = ctx.params.id
  const by = session.user.name

  await prisma.order.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      updatedBy: by,
      audits: { create: { action: "DELETE", byUser: by, note: "Pedido eliminado (soft)" } },
    },
  })

  return NextResponse.json({ ok: true })
}
