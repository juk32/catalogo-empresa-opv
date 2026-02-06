import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { randomUUID } from "crypto"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const file = form.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "Falta archivo (field: file)" }, { status: 400 })
    }

    // (opcional) validar tipo
    const allowed = ["image/png", "image/jpeg", "image/webp"]
    if (file.type && !allowed.includes(file.type)) {
      return NextResponse.json({ error: "Formato no permitido. Usa PNG/JPG/WEBP." }, { status: 400 })
    }

    // nombre seguro + único
    const original = (file.name || "upload").replace(/[^\w.\-]+/g, "_")
    const key = `products/${randomUUID()}-${original}`

    const blob = await put(key, file, {
      access: "public",
      addRandomSuffix: false,
    })

    return NextResponse.json({ ok: true, url: blob.url, pathname: blob.pathname })
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Error subiendo imagen" },
      { status: 500 }
    )
  }
}
