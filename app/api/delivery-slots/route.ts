import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export const runtime = "nodejs"

function isAdmin(session: any) {
  const role = session?.user && (session.user as any).role
  return role === "ADMIN"
}

// GET: slots activos futuros (público)
export async function GET() {
  const now = new Date()

  const slots = await prisma.deliverySlot.findMany({
    where: { active: true, endAt: { gt: now } },
    orderBy: { startAt: "asc" },
  })

  return NextResponse.json(slots)
}

type CreateSlotBody = {
  startAt: string
  endAt: string
  capacity?: number
  active?: boolean
}

// POST: crear slot (solo ADMIN)
export async function POST(req: Request) {
  const session = await auth()
  if (!isAdmin(session)) {
    return NextResponse.json({ error: "Solo ADMIN" }, { status: 403 })
  }

  const body = (await req.json()) as CreateSlotBody

  const startAt = new Date(body.startAt)
  const endAt = new Date(body.endAt)

  if (isNaN(startAt.getTime()) || isNaN(endAt.getTime())) {
    return NextResponse.json({ error: "Fechas inválidas" }, { status: 400 })
  }
  if (endAt <= startAt) {
    return NextResponse.json(
      { error: "endAt debe ser mayor a startAt" },
      { status: 400 }
    )
  }

  const capacity = body.capacity ?? 999
  if (!Number.isFinite(capacity) || capacity < 1) {
    return NextResponse.json({ error: "capacity inválida" }, { status: 400 })
  }

  // Opcional: no permitir crear slots ya pasados
  const now = new Date()
  if (endAt <= now) {
    return NextResponse.json(
      { error: "No puedes crear un slot que ya terminó" },
      { status: 400 }
    )
  }

  const slot = await prisma.deliverySlot.create({
    data: {
      startAt,
      endAt,
      capacity,
      active: body.active ?? true,
    },
  })

  return NextResponse.json(slot)
}
