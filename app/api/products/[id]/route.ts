import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export const runtime = "nodejs"

type Ctx = {
  params: Promise<{ id: string }>
}

export async function GET(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params

  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const role = (session.user as any)?.role
  if (role !== "ADMIN") {
    return NextResponse.json({ error: "Solo ADMIN" }, { status: 403 })
  }

  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
  }

  return NextResponse.json(product)
}

export async function PATCH(req: Request, ctx: Ctx) {
  const { id } = await ctx.params

  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const role = (session.user as any)?.role
  if (role !== "ADMIN") {
    return NextResponse.json({ error: "Solo ADMIN" }, { status: 403 })
  }

  const body = await req.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 })
  }

  const data: any = {}
  if (body.name !== undefined) data.name = String(body.name)
  if (body.price !== undefined) data.price = Number(body.price)
  if (body.category !== undefined) data.category = String(body.category)
  if (body.image !== undefined) data.image = String(body.image)
  if (body.description !== undefined) data.description = String(body.description)
  if (body.details !== undefined) data.details = body.details
  if (body.rating !== undefined) data.rating = Number(body.rating)
  if (body.stock !== undefined) data.stock = Number(body.stock)

  const updated = await prisma.product.update({
    where: { id },
    data,
  })

  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params

  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const role = (session.user as any)?.role
  if (role !== "ADMIN") {
    return NextResponse.json({ error: "Solo ADMIN" }, { status: 403 })
  }

  try {
    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      { error: "No se pudo borrar (posible relación con pedidos o restricción BD)" },
      { status: 400 }
    )
  }
}
