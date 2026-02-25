import React from "react"
import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { renderToBuffer } from "@react-pdf/renderer"
import QRCode from "qrcode"
import PedidoPDF from "@/lib/pdf/PedidoPDF"

export const runtime = "nodejs"

function getPublicBaseUrl(req: NextRequest) {
  // ✅ Preferimos el dominio real configurado en Vercel
  const env = process.env.NEXT_PUBLIC_APP_URL
  if (env && env.startsWith("http")) return env.replace(/\/$/, "")

  // Fallback (sirve si no hay env var)
  const proto = req.headers.get("x-forwarded-proto") || "http"
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host")
  return `${proto}://${host}`
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return new Response("Falta ?id=", { status: 400 })

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  })
  if (!order) return new Response("Pedido no encontrado", { status: 404 })

  const baseUrl = getPublicBaseUrl(req)
  const logoUrl = `${baseUrl}/logo.png`

  // ✅ QR apunta al HUB (panel de opciones)
  const qrTarget = `${baseUrl}/qr/pedido/${encodeURIComponent(order.id)}`

  let qrDataUrl = ""
  try {
    qrDataUrl = await QRCode.toDataURL(qrTarget, {
      errorCorrectionLevel: "M",
      margin: 0,
      scale: 8,
      type: "image/png",
    })
  } catch {
    qrDataUrl = ""
  }

  const data = {
    id: order.id,
    folio: order.folio,
    fecha: new Date(order.createdAt).toLocaleDateString("es-MX"),
    solicitadoPor: order.customerName,
    vendedor: (order as any).sellerName ?? "—",
    moneda: "MXN",
    empresaNombre: "OPERADORA BALLES VEGA DE HIDALGO",
    rfcEmpresa: "OBV191007BS1",
    empresaDireccionLine1: "SANTA CATARINA PARC 81 Z1 SIN SANTIAGO TLAPACOYA",
    empresaDireccionLine2: "PACHUCA DE SOTO HIDALGO MEXICO 42110",
    logoUrl,
    qrDataUrl: qrDataUrl || undefined,
    status: order.status,
    deliveredAt: order.deliveryAt ? new Date(order.deliveryAt).toLocaleString("es-MX") : null,
    deliveredBy: (order as any).deliveredBy ?? null,
    proveedorNombre: (order as any).providerName ?? "—",
    proveedorRFC: (order as any).providerRFC ?? "—",
    proveedorCalle: (order as any).providerStreet ?? "—",
    proveedorNumExt: (order as any).providerNumExt ?? "—",
    proveedorCP: (order as any).providerCP ?? "—",
    proveedorMunicipio: (order as any).providerCity ?? "—",
    proveedorEstado: (order as any).providerState ?? "—",
    proveedorTel: (order as any).providerPhone ?? "—",
    lugarEntrega: (order as any).deliveryPlace ?? "—",
    fechaRecepcion: (order as any).receivedAt ? new Date((order as any).receivedAt).toLocaleDateString("es-MX") : "—",
    observaciones: (order as any).notes ?? "—",
    items: order.items.map((it: any) => ({
      clave: it.productId ?? "—",
      descripcion: it.name,
      unidad: it.unit ?? "PZA",
      cantidad: it.qty,
      costoUnitario: it.unitPrice,
    })),
  }

  const element: any = React.createElement(PedidoPDF as any, { data } as any)
  const pdfBuffer = await renderToBuffer(element)

  return new Response(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=requisicion-${order.folio}.pdf`,
    },
  })
}