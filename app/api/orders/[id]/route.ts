import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export const runtime = "nodejs"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

  const { id } = await params
  if (!id) return NextResponse.json({ error: "Falta id" }, { status: 400 })

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, deliverySlot: true },
  })

  if (!order || order.deletedAt) {
    return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 })
  }

  return NextResponse.json(order)
}

type PatchBody = {
  customerName?: string
  deliverySlotId?: string | null
  items?: Array<{
    productId: string
    name: string
    unitPrice: number
    qty: number
    unit?: string
  }>
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

  const role = (session.user as any).role as string | undefined
  if (role !== "VENDEDOR" && role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const { id } = await params
  if (!id) return NextResponse.json({ error: "Falta id" }, { status: 400 })

  const body = (await req.json()) as PatchBody
  const userName = session.user.name ?? "Usuario"

  // validar slot si lo mandan
  if (body.deliverySlotId !== undefined && body.deliverySlotId !== null) {
    const slot = await prisma.deliverySlot.findUnique({ where: { id: body.deliverySlotId } })
    if (!slot || !slot.enabled) {
      return NextResponse.json({ error: "Horario inválido" }, { status: 400 })
    }
  }

  const updated = await prisma.$transaction(async (tx) => {
    const existing = await tx.order.findUnique({
      where: { id },
      include: { items: true },
    })

    if (!existing || existing.deletedAt) {
      throw new Error("Pedido no encontrado")
    }

    // reemplazo total de items si vienen
    if (body.items) {
      await tx.orderItem.deleteMany({ where: { orderId: id } })
      await tx.orderItem.createMany({
        data: body.items.map((it) => ({
          orderId: id,
          productId: it.productId,
          name: it.name,
          unitPrice: it.unitPrice,
          qty: it.qty,
          unit: it.unit ?? "PZ",
        })),
      })
    }

    const order = await tx.order.update({
      where: { id },
      data: {
        customerName: body.customerName?.trim() || undefined,
        deliverySlotId: body.deliverySlotId === undefined ? undefined : body.deliverySlotId,
        updatedBy: userName,
        audits: { create: { action: "EDIT", byUser: userName } },
      },
      include: { items: true, deliverySlot: true },
    })

    return order
  })

  return NextResponse.json(updated)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

  const role = (session.user as any).role as string | undefined
  if (role !== "ADMIN") return NextResponse.json({ error: "Solo ADMIN" }, { status: 403 })

  const { id } = await params
  if (!id) return NextResponse.json({ error: "Falta id" }, { status: 400 })

  const userName = session.user.name ?? "Usuario"

  await prisma.order.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      updatedBy: userName,
      audits: { create: { action: "DELETE", byUser: userName } },
    },
  })

  return NextResponse.json({ ok: true })
}
