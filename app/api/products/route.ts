import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

function normalizeDetails(details: any) {
  if (Array.isArray(details)) return details
  const s = String(details || "")
  return s
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean)
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(products, {
      headers: { "Cache-Control": "no-store" },
    })
  } catch (e: any) {
    console.error("GET /api/products error:", e)
    return NextResponse.json(
      { error: e?.message || "Error cargando productos" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const id = String(body?.id || "").trim()
    const name = String(body?.name || "").trim()
    const category = String(body?.category || "").trim()
    const image = String(body?.image || "").trim()
    const description = String(body?.description || "").trim()

    const price = Number(body?.price)
    const stock = Number(body?.stock)
    const rating = Number(body?.rating ?? 4.5)

    if (!id) return NextResponse.json({ error: "Falta id" }, { status: 400 })
    if (!name) return NextResponse.json({ error: "Falta name" }, { status: 400 })
    if (!category) return NextResponse.json({ error: "Falta category" }, { status: 400 })
    if (Number.isNaN(price)) return NextResponse.json({ error: "price inválido" }, { status: 400 })
    if (Number.isNaN(stock)) return NextResponse.json({ error: "stock inválido" }, { status: 400 })

    const details = normalizeDetails(body?.details)

    const created = await prisma.product.create({
      data: {
        id,
        name,
        category,
        image,
        description,
        details,
        rating,
        price,
        stock,
      },
    })

    return NextResponse.json(created)
  } catch (e: any) {
    console.error("POST /api/products error:", e)

    const msg =
      e?.code === "P2002"
        ? "ID duplicado (ya existe un producto con esa clave)."
        : e?.message || "Error guardando producto"

    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
