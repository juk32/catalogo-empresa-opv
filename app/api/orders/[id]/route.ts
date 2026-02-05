import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export const runtime = "nodejs"

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  if (!id) return NextResponse.json({ error: "Falta id" }, { status: 400 })

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  })

  if (!order || order.deletedAt) {
    return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 })
  }

  return NextResponse.json(order)
}

type PatchBody = {
  customerName?: string
  deliveryAt?: string | null
  items?: Array<{
    productId: string
    name: string
    unitPrice: number
    qty: number
    unit?: string
  }>
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

  const role = (session.user as any).role as string | undefined
  if (role !== "VENDEDOR" && role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const { id } = await ctx.params
  if (!id) return NextResponse.json({ error: "Falta id" }, { status: 400 })

  const body = (await req.json()) as PatchBody
  const userName = session.user.name ?? "Usuario"

  try {
    const updated = await prisma.$transaction(async (tx) => {
      const existing = await tx.order.findUnique({
        where: { id },
        include: { items: true },
      })

      if (!existing || existing.deletedAt) {
        throw new Error("Pedido no encontrado")
      }

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

      const dataToUpdate: any = {
        customerName: body.customerName?.trim() || undefined,
        updatedBy: userName,
        audits: { create: { action: "EDIT", byUser: userName } },
      }

      // ✅ Solo ADMIN puede modificar deliveryAt
      if (role === "ADMIN" && body.deliveryAt !== undefined) {
        dataToUpdate.deliveryAt = body.deliveryAt ? new Date(body.deliveryAt) : null
      }

      const order = await tx.order.update({
        where: { id },
        data: dataToUpdate,
        include: { items: true },
      })

      return order
    })

    return NextResponse.json(updated)
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Error" }, { status: 400 })
  }
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

  const role = (session.user as any).role as string | undefined
  if (role !== "ADMIN") return NextResponse.json({ error: "Solo ADMIN" }, { status: 403 })

  const { id } = await ctx.params
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
