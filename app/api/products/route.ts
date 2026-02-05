import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export const runtime = "nodejs"

/* =========================
   LISTAR productos (ADMIN)
========================= */
export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const role = (session.user as any)?.role
  if (role !== "ADMIN") {
    return NextResponse.json({ error: "Solo ADMIN" }, { status: 403 })
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(products)
}

/* =========================
   CREAR producto
========================= */
export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const role = (session.user as any)?.role
  if (role !== "ADMIN") {
    return NextResponse.json({ error: "Solo ADMIN" }, { status: 403 })
  }

  const body = await req.json().catch(() => null)
  if (!body?.id || !body?.name) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 })
  }

  const created = await prisma.product.create({
    data: {
      id: body.id,
      name: body.name,
      price: Number(body.price ?? 0),
      category: body.category ?? "",
      image: body.image ?? "",
      description: body.description ?? "",
      details: body.details ?? [],
      rating: Number(body.rating ?? 5),
      stock: Number(body.stock ?? 0),
    },
  })

  return NextResponse.json(created)
}
