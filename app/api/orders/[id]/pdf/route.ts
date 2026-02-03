import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { renderToBuffer } from "@react-pdf/renderer"
import React from "react"
import PedidoPDF, { type PedidoPDFData } from "@/lib/pdf/PedidoPDF"

export const runtime = "nodejs"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> } // 👈 OJO: Promise
) {
  const { id } = await params // 👈 OJO: await
  if (!id) return NextResponse.json({ error: "Falta id" }, { status: 400 })

  // (opcional) proteger PDF
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  })

  if (!order || order.deletedAt) {
    return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 })
  }

  const data: PedidoPDFData = {
    folio: order.folio,
    fecha: order.createdAt.toISOString().slice(0, 10), // yyyy-mm-dd
    solicitadoPor: order.customerName,
    vendedor: order.createdBy,
    items: order.items.map((it) => ({
      clave: it.productId,
      descripcion: it.name,
      unidad: it.unit,
      cantidad: it.qty,
      costoUnitario: it.unitPrice,
    })),
  }

  // Tipado de react-pdf suele pelear: casteo simple y estable
  const pdfBuffer = await renderToBuffer(
    React.createElement(PedidoPDF as any, { data }) as any
  )

  const bytes = new Uint8Array(pdfBuffer)

  return new Response(bytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${order.folio}.pdf"`,
    },
  })
}
