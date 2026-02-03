import { NextResponse } from "next/server"
import { auth } from "@/auth"

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ user: null }, { status: 200 })

  return NextResponse.json({
    user: {
      name: session.user.name ?? "",
      role: (session.user as any).role ?? null,
    },
  })
}
