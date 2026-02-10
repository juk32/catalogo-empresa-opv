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

// ✅ En tu Next: params viene como Promise
type Ctx = { params: Promise<{ id: string }> }

function safeId(raw: string) {
  return decodeURIComponent(String(raw || "")).trim()
}

export async function GET(_req: Request, ctx: Ctx) {
  try {
    const { id: rawId } = await ctx.params
    const id = safeId(rawId)
    if (!id) return NextResponse.json({ error: "Falta id" }, { status: 400 })

    const p = await prisma.product.findUnique({ where: { id } })
    if (!p || p.deletedAt) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    return NextResponse.json(p, { headers: { "Cache-Control": "no-store" } })
  } catch (e: any) {
    console.error("GET /api/products/[id] error:", e)
    return NextResponse.json({ error: e?.message || "Error" }, { status: 500 })
  }
}

export async function PATCH(req: Request, ctx: Ctx) {
  try {
    const { id: rawId } = await ctx.params
    const id = safeId(rawId)
    if (!id) return NextResponse.json({ error: "Falta id" }, { status: 400 })

    const body = await req.json()
    const data: any = {}

    if (body.name !== undefined) data.name = String(body.name || "").trim()
    if (body.category !== undefined) data.category = String(body.category || "").trim()
    if (body.image !== undefined) data.image = String(body.image || "").trim()
    if (body.description !== undefined) data.description = String(body.description || "").trim()

    if (body.price !== undefined) data.price = Number(body.price)
    if (body.stock !== undefined) data.stock = Number(body.stock)
    if (body.rating !== undefined) data.rating = Number(body.rating)

    if (body.details !== undefined) data.details = normalizeDetails(body.details)

    const updated = await prisma.product.update({
      where: { id },
      data,
    })

    return NextResponse.json(updated)
  } catch (e: any) {
    console.error("PATCH /api/products/[id] error:", e)

    const msg =
      e?.code === "P2025"
        ? "Producto no encontrado"
        : e?.message || "Error actualizando producto"

    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  try {
    const { id: rawId } = await ctx.params
    const id = safeId(rawId)
    if (!id) return NextResponse.json({ error: "Falta id" }, { status: 400 })

    await prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error("DELETE /api/products/[id] error:", e)

    const msg =
      e?.code === "P2025"
        ? "Producto no encontrado"
        : e?.message || "Error eliminando producto"

    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
