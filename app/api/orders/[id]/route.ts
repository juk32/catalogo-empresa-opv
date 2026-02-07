import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export const runtime = "nodejs"

function getRole(session: any) {
  return (session?.user as any)?.role as string | undefined
}

function isAdmin(session: any) {
  return getRole(session) === "ADMIN"
}

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const { id } = await ctx.params
  if (!id) return NextResponse.json({ error: "Falta id" }, { status: 400 })

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, audits: { orderBy: { at: "desc" } } },
  })

  if (!order || order.deletedAt) {
    return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 })
  }

  return NextResponse.json(order)
}

type PatchBody = {
  customerName?: string
  deliveryAt?: string | null
  // 🚫 No aceptamos edición de items aquí
  // items?: ...
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  // ✅ Solo ADMIN puede editar pedido (si quieres que VENDEDOR edite, dime y lo abrimos)
  if (!isAdmin(session)) {
    return NextResponse.json({ error: "Solo ADMIN" }, { status: 403 })
  }

  const { id } = await ctx.params
  if (!id) return NextResponse.json({ error: "Falta id" }, { status: 400 })

  const body = (await req.json().catch(() => ({}))) as PatchBody

  const existing = await prisma.order.findUnique({ where: { id } })
  if (!existing || existing.deletedAt) {
    return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 })
  }

  const userName = session.user.name ?? "Admin"

  const data: any = {
    updatedBy: userName,
    audits: { create: { action: "EDIT", byUser: userName } },
  }

  if (typeof body.customerName === "string") {
    const name = body.customerName.trim()
    if (!name) return NextResponse.json({ error: "customerName inválido" }, { status: 400 })
    data.customerName = name
  }

  if (body.deliveryAt !== undefined) {
    data.deliveryAt = body.deliveryAt ? new Date(body.deliveryAt) : null
  }

  // 🚫 Importante: NO se actualizan items aquí, así nunca cambian nombres/precios por edición
  const updated = await prisma.order.update({
    where: { id },
    data,
    include: { items: true, audits: { orderBy: { at: "desc" } } },
  })

  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  // ✅ Solo ADMIN borra
  if (!isAdmin(session)) {
    return NextResponse.json({ error: "Solo ADMIN" }, { status: 403 })
  }

  const { id } = await ctx.params
  if (!id) return NextResponse.json({ error: "Falta id" }, { status: 400 })

  const existing = await prisma.order.findUnique({
    where: { id },
    select: { id: true, deletedAt: true },
  })

  if (!existing || existing.deletedAt) {
    return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 })
  }

  const userName = session.user.name ?? "Admin"

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
