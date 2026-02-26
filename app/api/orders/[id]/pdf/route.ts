import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { renderToBuffer } from "@react-pdf/renderer"
import React from "react"
import PedidoPDF, { type PedidoPDFData } from "@/lib/pdf/PedidoPDF"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type Ctx = { params: Promise<{ id: string }> }

function normalizeBase(url: string) {
  // quita slash final si existe
  return url.replace(/\/+$/, "")
}

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id: raw } = await params
  const id = decodeURIComponent(raw || "")

  if (!id) {
    return new Response(JSON.stringify({ error: "Falta id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  // (opcional) proteger PDF
  const session = await auth()
  if (!session?.user) {
    return new Response(JSON.stringify({ error: "No autenticado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    })
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  })

  if (!order || order.deletedAt) {
    return new Response(JSON.stringify({ error: "Pedido no encontrado" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    })
  }

// ✅ URL final para QR (Vercel)
const base = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/+$/, "")
const qrUrl = `${base}/pedidos?deliver=${encodeURIComponent(order.id)}`


  const data: PedidoPDFData = {
    folio: order.folio,
    fecha: order.createdAt.toISOString().slice(0, 10),
    solicitadoPor: order.customerName,
    vendedor: order.createdBy,
    qrUrl, // ✅ QR siempre lleva al gate /qr/pedido/[id]
    items: order.items.map((it) => ({
      clave: it.productId,
      descripcion: it.name,
      unidad: it.unit,
      cantidad: it.qty,
      costoUnitario: it.unitPrice,
    })),
  }

  const pdfBuffer = await renderToBuffer(
    React.createElement(PedidoPDF as any, { data }) as any
  )
  const bytes = new Uint8Array(pdfBuffer)

  return new Response(bytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${order.folio}.pdf"`,
      "Cache-Control": "no-store",
    },
  })
}