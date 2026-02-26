import { auth } from "@/auth"
import { redirect } from "next/navigation"

export const runtime = "nodejs"

type Ctx = { params: Promise<{ id: string }> }

export default async function Page({ params }: Ctx) {
  const { id: raw } = await params
  const id = decodeURIComponent(raw)

  const session = await auth()

  if (!session?.user) {
    redirect(`/login?callbackUrl=${encodeURIComponent(`/qr/pedido/${id}`)}`)
  }

  redirect(`/pedidos?deliver=${encodeURIComponent(id)}`)
}