import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import PDFDocument from "pdfkit"
import QRCode from "qrcode"

export const runtime = "nodejs"

function money(n: number) {
  return (Number(n) || 0).toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function getBaseUrl(req: NextRequest) {
  const proto = req.headers.get("x-forwarded-proto") ?? "http"
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "localhost:3000"
  return `${proto}://${host}`
}

export async function GET(req: NextRequest) {
  try {
    const baseUrl = getBaseUrl(req)
    const catalogUrl = `${baseUrl}/productos`

    const products = await prisma.product.findMany({
      orderBy: [{ category: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        price: true,
        category: true,
        stock: true,
      },
    })

    const qrDataUrl = await QRCode.toDataURL(catalogUrl, {
      errorCorrectionLevel: "M",
      margin: 1,
      scale: 7,
    })
    const qrBase64 = qrDataUrl.split(",")[1]
    const qrBuffer = Buffer.from(qrBase64, "base64")

    const doc = new PDFDocument({ size: "A4", margin: 40 })

    const chunks: Buffer[] = []
    doc.on("data", (c: Buffer) => chunks.push(c))

    const done = new Promise<Buffer>((resolve, reject) => {
      doc.on("end", () => resolve(Buffer.concat(chunks)))
      doc.on("error", reject)
    })

    // ===== Header =====
    doc.fontSize(18).text("Operadora Balles — Catálogo", { align: "left" })
    doc.moveDown(0.2)
    doc.fontSize(10).fillColor("#4b5563").text(`Generado: ${new Date().toLocaleString("es-MX")}`)
    doc.fillColor("#111827")
    doc.moveDown(0.8)

    // QR
    const qrSize = 110
    const qrX = doc.page.width - doc.page.margins.right - qrSize
    const qrY = doc.y - 60
    doc.image(qrBuffer, qrX, qrY, { width: qrSize, height: qrSize })

    doc
      .fontSize(10)
      .fillColor("#111827")
      .text("Escanea para abrir el catálogo digital:", qrX - 240, qrY + 12, { width: 230, align: "right" })

    doc
      .fontSize(9)
      .fillColor("#2563eb")
      .text(catalogUrl, qrX - 240, qrY + 32, {
        width: 230,
        align: "right",
        link: catalogUrl,
        underline: true,
      })

    doc.fillColor("#111827")
    doc.moveDown(1.0)

    doc
      .moveTo(doc.page.margins.left, doc.y)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y)
      .strokeColor("#e5e7eb")
      .stroke()
    doc.moveDown(0.8)

    // ===== Tabla =====
    const left = doc.page.margins.left
    const right = doc.page.width - doc.page.margins.right
    const width = right - left

    const colCat = Math.floor(width * 0.22)
    const colName = Math.floor(width * 0.50)
    const colPrice = Math.floor(width * 0.16)
    const colStock = width - colCat - colName - colPrice

    function headerRow() {
      const y = doc.y
      doc.fontSize(10).fillColor("#111827")
      doc.text("Categoría", left, y, { width: colCat })
      doc.text("Producto", left + colCat, y, { width: colName })
      doc.text("Precio", left + colCat + colName, y, { width: colPrice, align: "right" })
      doc.text("Stock", left + colCat + colName + colPrice, y, { width: colStock, align: "right" })

      doc.moveDown(0.35)
      doc.moveTo(left, doc.y).lineTo(right, doc.y).strokeColor("#e5e7eb").stroke()
      doc.moveDown(0.55)
    }

    function ensureSpace(h = 22) {
      const bottom = doc.page.height - doc.page.margins.bottom
      if (doc.y + h > bottom) {
        doc.addPage()
        doc.fontSize(12).fillColor("#111827").text("Operadora Balles — Catálogo (continuación)")
        doc.moveDown(0.6)
        headerRow()
      }
    }

    headerRow()

    doc.fontSize(9).fillColor("#111827")

    for (const p of products) {
      ensureSpace(26)
      const y = doc.y

      const cat = (p.category ?? "Sin categoría").toString()
      const name = (p.name ?? "—").toString()
      const price = typeof p.price === "number" ? `$${money(p.price)}` : "—"
      const stock = typeof p.stock === "number" ? String(p.stock) : "—"

      doc.text(cat, left, y, { width: colCat })
      doc.text(name, left + colCat, y, { width: colName })
      doc.text(price, left + colCat + colName, y, { width: colPrice, align: "right" })
      doc.text(stock, left + colCat + colName + colPrice, y, { width: colStock, align: "right" })

      doc.moveDown(0.85)
      doc.moveTo(left, doc.y).lineTo(right, doc.y).strokeColor("#f1f5f9").stroke()
      doc.moveDown(0.25)
    }

    doc.moveDown(1.0)
    doc.fontSize(8).fillColor("#6b7280").text("Operadora Balles • Catálogo generado automáticamente", {
      align: "center",
    })

    doc.end()
    const pdfBuffer = await done

    // ✅ FIX TS/BodyInit: usar Uint8Array
    const body = new Uint8Array(pdfBuffer)

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
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