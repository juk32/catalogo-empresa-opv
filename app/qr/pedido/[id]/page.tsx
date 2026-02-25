<<<<<<< HEAD
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
=======
import QrShareClient from "./QrShareClient"

export const runtime = "nodejs"
type Ctx = { params: Promise<{ id: string }> }

export default async function Page({ params }: Ctx) {
  const { id: raw } = await params
  const id = decodeURIComponent(raw)
  return <QrShareClient id={id} />
>>>>>>> 2e7a60b707bf2321381abf6809845c614bc4ac67
}