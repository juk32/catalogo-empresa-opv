import React from "react"
import { renderToBuffer } from "@react-pdf/renderer"
import { prisma } from "@/lib/prisma"
import PedidoPDF, { type PedidoPDFData } from "@/lib/pdf/PedidoPDF"

export const runtime = "nodejs"

export async function GET(_: Request, ctx: { params: { id: string } }) {
  const order = await prisma.order.findFirst({
    where: { id: ctx.params.id, deletedAt: null },
    include: { items: true },
  })

  if (!order) return new Response("No existe", { status: 404 })

  const data: PedidoPDFData = {
    folio: order.folio,
    fecha: order.createdAt.toISOString().slice(0, 10),
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

  const pdfBuffer = await renderToBuffer(React.createElement(PedidoPDF as any, { data } as any))

  // ✅ FIX: Buffer -> Uint8Array (BodyInit compatible)
  const bytes = new Uint8Array(pdfBuffer)

  return new Response(bytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${order.folio}.pdf"`,
    },
  })
}
