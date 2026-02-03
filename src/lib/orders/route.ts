import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"


type BodyItem = {
  productId: string
  name: string
  unitPrice: number
  qty: number
  unit?: string
}

type CreateOrderBody = {
  customerName: string
  items: BodyItem[]
}

export const runtime = "nodejs"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.name) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const role = (session.user as any).role as string | undefined
  if (role !== "VENDEDOR" && role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const body = (await req.json()) as CreateOrderBody
  const customerName = String(body.customerName ?? "").trim()
  const items = Array.isArray(body.items) ? body.items : []

  if (!customerName) {
    return NextResponse.json({ error: "Falta customerName" }, { status: 400 })
  }
  if (items.length === 0) {
    return NextResponse.json({ error: "No hay items" }, { status: 400 })
  }

  // Validaciones básicas
  for (const it of items) {
    if (!it.productId || !it.name || !Number.isFinite(it.unitPrice) || !Number.isFinite(it.qty)) {
      return NextResponse.json({ error: "Item inválido" }, { status: 400 })
    }
    if (it.qty <= 0) {
      return NextResponse.json({ error: "Cantidad inválida" }, { status: 400 })
    }
  }

  const createdBy = session.user.name

  // Folio consecutivo con OrderCounter
  const result = await prisma.$transaction(async (tx) => {
    const counter = await tx.orderCounter.upsert({
      where: { id: 1 },
      create: { id: 1, lastFolio: 0 },
      update: {},
    })

    const next = counter.lastFolio + 1

    await tx.orderCounter.update({
      where: { id: 1 },
      data: { lastFolio: next },
    })

    const createdAt = new Date()
    const folio = buildFolio(next, createdAt, createdBy)

    const order = await tx.order.create({
      data: {
        folioNumber: next,
        folio,
        customerName,
        createdBy,
        items: {
          create: items.map((it) => ({
            productId: it.productId,
            name: it.name,
            unitPrice: it.unitPrice,
            qty: Math.trunc(it.qty),
            unit: it.unit ?? "PZ",
          })),
        },
        audits: {
          create: {
            action: "CREATE",
            byUser: createdBy,
            note: "Pedido creado",
          },
        },
      },
      include: { items: true },
    })

    return order
  })

  return NextResponse.json({
    id: result.id,
    folio: result.folio,
    folioNumber: result.folioNumber,
  })
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.name) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }
  const role = (session.user as any).role as string | undefined
  if (role !== "VENDEDOR" && role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const orders = await prisma.order.findMany({
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
    },
    take: 200,
  })

  return NextResponse.json(orders)
}
