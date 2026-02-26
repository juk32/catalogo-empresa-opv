import { Suspense } from "react"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import PedidosClient from "./PedidosClient"

export const runtime = "nodejs"

type Ctx = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function Page({ searchParams }: Ctx) {
  const sp = await searchParams
  const deliver = typeof sp.deliver === "string" ? sp.deliver : ""

  const session = await auth()

  // ✅ si NO hay sesión -> login y regresa EXACTO a pedidos con deliver
  if (!session?.user) {
    const cb = deliver ? `/pedidos?deliver=${encodeURIComponent(deliver)}` : "/pedidos"
    redirect(`/login?callbackUrl=${encodeURIComponent(cb)}`)
  }

  return (
    <Suspense fallback={<div className="p-6 text-slate-600">Cargando pedidos…</div>}>
      <PedidosClient initialDeliver={deliver} />
    </Suspense>
  )
}