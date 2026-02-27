import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { renderToBuffer } from "@react-pdf/renderer"
import React from "react"
import QRCode from "qrcode"
import CatalogoPDF, { type CatalogoPDFData } from "@/components/pdf/CatalogoPDF"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(_req: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      orderBy: [{ category: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        category: true,
        price: true,
        stock: true,
      },
    })

    // ✅ EXACTAMENTE como el de pedidos:
    const base = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/+$/, "")
    const qrUrl = `${base}/productos`

    const qrDataUrl = await QRCode.toDataURL(qrUrl, {
      errorCorrectionLevel: "M",
      margin: 1,
      scale: 6,
    })

    const data: CatalogoPDFData = {
      fecha: new Date().toLocaleString("es-MX"),
      qrDataUrl,
      items: products.map((p) => ({
        id: String(p.id),
        name: String(p.name ?? ""),
        category: String(p.category ?? "Sin categoría"),
        price: Number(p.price ?? 0),
        stock: Number(p.stock ?? 0),
      })),
    }

    // ✅ Igual que tu pedidos (evita JSX en .ts con createElement)
    const pdfBuffer = await renderToBuffer(React.createElement(CatalogoPDF as any, { data }) as any)

    // ✅ Igual que pedidos:
    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        // puedes usar attachment si quieres descargar, o inline si quieres abrir en navegador
        "Content-Disposition": `inline; filename="catalogo-operadora-balles.pdf"`,
        "Cache-Control": "no-store",
      },
    })
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e?.message ?? "Error PDF" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}