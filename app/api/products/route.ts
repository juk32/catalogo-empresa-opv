import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 300,
      select: {
        id: true,
        name: true,
        price: true,
        category: true,
        image: true,
        description: true,
        stock: true,
        createdAt: true,
      },
    })

    return NextResponse.json(products, {
      headers: {
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    console.error("ERROR /api/products:", error)
    return NextResponse.json({ error: "Error cargando productos" }, { status: 500 })
  }
}
