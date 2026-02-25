// app/qr/producto/[id]/page.tsx
import { auth } from "@/auth"
import QrShareClient from "./QrShareClient"

type Ctx = { params: Promise<{ id: string }> }

export default async function QrProductoPage({ params }: Ctx) {
  const { id } = await params

  const session = await auth()
  const isLoggedIn = !!session?.user

  return <QrShareClient id={id} isLoggedIn={isLoggedIn} />
}