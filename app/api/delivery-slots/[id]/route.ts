import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export const runtime = "nodejs"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

  const role = (session.user as any).role as string | undefined
  if (role !== "ADMIN") return NextResponse.json({ error: "Solo ADMIN" }, { status: 403 })

  const { id } = await params
  const body = (await req.json()) as { enabled?: boolean; window?: string; date?: string }

  const data: any = {}
  if (typeof body.enabled === "boolean") data.enabled = body.enabled
  if (typeof body.window === "string") data.window = body.window.trim()
  if (typeof body.date === "string") data.date = new Date(body.date + "T00:00:00")

  const updated = await prisma.deliverySlot.update({ where: { id }, data })
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

  // si hay pedidos con ese slot, lo desligamos
  await prisma.order.updateMany({
    where: { deliverySlotId: id },
    data: { deliverySlotId: null },
  })

  await prisma.deliverySlot.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
