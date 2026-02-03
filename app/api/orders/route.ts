import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { buildFolio } from "@/lib/orders/folio"

export const runtime = "nodejs"

type CreateOrderBody = {
  customerName: string
  deliverySlotId?: string
  items: Array<{
    productId: string
    name: string
    unitPrice: number
    qty: number
    unit?: string
  }>
}

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

  const rows = await prisma.order.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      folio: true,
      customerName: true,
      status: true,
      createdAt: true,
      createdBy: true,
      updatedAt: true,
      updatedBy: true,
      deliverySlot: { select: { id: true, date: true, window: true, enabled: true } },
    },
  })

  return NextResponse.json(rows)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

  const role = (session.user as any).role as string | undefined
  if (role !== "VENDEDOR" && role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const body = (await req.json()) as CreateOrderBody

  if (!body.customerName?.trim()) {
    return NextResponse.json({ error: "Falta customerName" }, { status: 400 })
  }
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "Faltan items" }, { status: 400 })
  }

  // validar slot si viene
  if (body.deliverySlotId) {
    const slot = await prisma.deliverySlot.findUnique({ where: { id: body.deliverySlotId } })
    if (!slot || !slot.enabled) {
      return NextResponse.json({ error: "Horario inválido" }, { status: 400 })
    }
  }

  const userName = session.user.name ?? "Usuario"

  const result = await prisma.$transaction(async (tx) => {
    const counter = await tx.orderCounter.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, lastFolio: 0 },
    })

    const next = counter.lastFolio + 1
    await tx.orderCounter.update({
      where: { id: 1 },
      data: { lastFolio: next },
    })

    const createdAt = new Date()
    const folio = buildFolio(next, createdAt, userName)

    const order = await tx.order.create({
      data: {
        folioNumber: next,
        folio,
        customerName: body.customerName.trim(),
        createdBy: userName,
        deliverySlotId: body.deliverySlotId ?? null,
        items: {
          create: body.items.map((it) => ({
            productId: it.productId,
            name: it.name,
            unitPrice: it.unitPrice,
            qty: it.qty,
            unit: it.unit ?? "PZ",
          })),
        },
        audits: { create: { action: "CREATE", byUser: userName } },
      },
      include: {
        items: true,
        deliverySlot: true,
      },
    })

    return order
  })

  return NextResponse.json(result)
}
