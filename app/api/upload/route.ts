import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { mkdir, writeFile } from "fs/promises"
import path from "path"
import crypto from "crypto"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado (sin sesión)" }, { status: 401 })
  }

  const role = (session.user as any)?.role
  if (role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado (solo ADMIN)" }, { status: 403 })
  }

  const formData = await req.formData()
  const file = formData.get("file")

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No llegó archivo (field: file)" }, { status: 400 })
  }

  const allowed = ["image/png", "image/jpeg", "image/webp"]
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: `Formato no permitido: ${file.type}` }, { status: 400 })
  }

  if (file.size > 3 * 1024 * 1024) {
    return NextResponse.json({ error: "Archivo muy grande (máx 3MB)" }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const ext =
    file.type === "image/png" ? "png" :
    file.type === "image/webp" ? "webp" : "jpg"

  const name = `${crypto.randomUUID()}.${ext}`
  const uploadDir = path.join(process.cwd(), "public", "uploads")

  await mkdir(uploadDir, { recursive: true })
  await writeFile(path.join(uploadDir, name), buffer)

  return NextResponse.json({ url: `/uploads/${name}` })
}
