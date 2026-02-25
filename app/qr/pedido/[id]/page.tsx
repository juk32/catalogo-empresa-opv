// app/qr/pedido/[id]/page.tsx
import { redirect } from "next/navigation"
import { auth } from "@/auth"

export default async function QrPedidoPage({ params }: { params: { id: string } }) {
  const id = params.id
  const session = await auth()

  if (!session?.user) {
    const cb = encodeURIComponent(`/qr/pedido/${id}`)
    redirect(`/login?callbackUrl=${cb}`)
  }

  redirect(`/pedidos?deliver=${encodeURIComponent(id)}`)
}