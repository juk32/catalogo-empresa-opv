import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export const runtime = "nodejs"

export async function GET() {
  const slots = await prisma.deliverySlot.findMany({
    orderBy: [{ date: "asc" }, { window: "asc" }],
  })
  return NextResponse.json(slots)
}

type CreateBody = {
  date: string // "YYYY-MM-DD"
  window: string // "10:00 - 12:00"
  enabled?: boolean
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const role = (session.user as any).role as string | undefined
  if (role !== "ADMIN") {
    return NextResponse.json({ error: "Solo ADMIN" }, { status: 403 })
  }

  const body = (await req.json()) as CreateBody

  if (!body.date?.trim() || !body.window?.trim()) {
    return NextResponse.json({ error: "Falta date/window" }, { status: 400 })
  }

  const d = new Date(body.date + "T00:00:00")

  const created = await prisma.deliverySlot.create({
    data: {
      date: d,
      window: body.window.trim(),
      enabled: body.enabled ?? true,
    },
  })

  return NextResponse.json(created)
}
