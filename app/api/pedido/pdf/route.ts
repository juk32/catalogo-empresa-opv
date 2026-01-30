import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { renderToBuffer } from "@react-pdf/renderer"
import PedidoPDF, { type PedidoPDFData } from "@/lib/pdf/PedidoPDF"

export const runtime = "nodejs" // importante para Buffer

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const role = (session.user as any).role as string | undefined
  if (role !== "VENDEDOR" && role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const body = (await req.json()) as Omit<PedidoPDFData, "vendedor">
  const vendedor = session.user.name ?? "Vendedor"

  const data: PedidoPDFData = {
    ...body,
    vendedor,
  }

  const pdfBuffer = await renderToBuffer(<PedidoPDF data={data} />)

  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="pedido-${data.folio}.pdf"`,
    },
  })
}
