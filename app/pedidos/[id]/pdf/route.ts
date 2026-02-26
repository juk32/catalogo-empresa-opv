// app/pedidos/[id]/pdf/route.ts
import { NextRequest, NextResponse } from "next/server"

// ✅ Fuerza Node (PDF libs usualmente requieren Node APIs)
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, ctx: Ctx) {
  try {
    const { id: raw } = await ctx.params
    const id = decodeURIComponent(raw)

    if (!id) {
      return NextResponse.json({ error: "Falta id" }, { status: 400 })
    }

    // =========================
    // AQUÍ GENERAS TU PDF
    // =========================
    const pdfBytes = minimalPdfBytes(`Pedido ${id}`)

    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="pedido-${id}.pdf"`,
        "Cache-Control": "no-store",
      },
    })
  } catch (e: any) {
    return NextResponse.json(
      { error: "Error generando PDF", detail: e?.message ?? String(e) },
      { status: 500 }
    )
  }
}

/**
 * PDF mínimo válido (para no romper build/route).
 * Sustituye por tu lógica real de PDF.
 */
function minimalPdfBytes(title: string) {
  const content = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << >> >> endobj
4 0 obj << /Length 56 >> stream
BT
/F1 24 Tf
72 720 Td
(${escapePdfText(title)}) Tj
ET
endstream endobj
xref
0 5
0000000000 65535 f
0000000010 00000 n
0000000062 00000 n
0000000117 00000 n
0000000245 00000 n
trailer << /Size 5 /Root 1 0 R >>
startxref
360
%%EOF`

  return new TextEncoder().encode(content)
}

function escapePdfText(s: string) {
  return s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)")
}