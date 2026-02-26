// app/qr/pedido/[id]/page.tsx

import { auth } from "@/auth"
import { redirect } from "next/navigation"

export const runtime = "nodejs"

type Ctx = { params: Promise<{ id: string }> }

export default async function Page({ params }: Ctx) {
  const { id: raw } = await params
  const id = decodeURIComponent(raw)

  if (!id) {
    redirect("/pedidos")
  }

  const session = await auth()

  // 🔐 Si NO está logueado → login
  if (!session?.user) {
    redirect(`/login?callbackUrl=${encodeURIComponent(`/qr/pedido/${id}`)}`)
  }

  // ✅ Si está logueado → abrir modal
  redirect(`/pedidos?deliver=${encodeURIComponent(id)}`)
}