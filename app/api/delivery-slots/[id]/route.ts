import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export const runtime = "nodejs"

function isAdmin(session: any) {
  const role = session?.user && (session.user as any).role
  return role === "ADMIN"
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!isAdmin(session)) return NextResponse.json({ error: "Solo ADMIN" }, { status: 403 })

  const { id } = await params
  if (!id) return NextResponse.json({ error: "Falta id" }, { status: 400 })

  await prisma.deliverySlot.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
