import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export const runtime = "nodejs"

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const { id } = await ctx.params
  if (!id) {
    return NextResponse.json({ error: "Falta id" }, { status: 400 })
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      audits: true,
    },
  })

  if (!order || order.deletedAt) {
    return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 })
  }

  return NextResponse.json(order)
}
