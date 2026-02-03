import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { renderToBuffer } from "@react-pdf/renderer"
import React from "react"
import PedidoPDF, { type PedidoPDFData } from "@/lib/pdf/PedidoPDF"

export const runtime = "nodejs"

export async function GET(_req: Request, ctx: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.name) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const role = (session.user as any).role as string | undefined
  if (role !== "VENDEDOR" && role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const id = ctx.params.id

  const order = await prisma.order.findFirst({
    where: { id, deletedAt: null },
    include: { items: true },
  })

  if (!order) {
    return NextResponse.json({ error: "Pedido no existe" }, { status: 404 })
  }

  const data: PedidoPDFData = {
    folio: order.folio,
    fecha: order.createdAt.toLocaleString("es-MX"),
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

  const pdfBuffer = await renderToBuffer(React.createElement(PedidoPDF as any, { data }) as any)

  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${order.folio}.pdf"`,
    },
  })
}
