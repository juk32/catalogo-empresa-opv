import { Suspense } from "react"
import PedidosClient from "./PedidosClient"

export const dynamic = "force-dynamic"

export default function PedidosPage() {
  return (
    <Suspense fallback={<div className="p-6 text-slate-600">Cargando…</div>}>
      <PedidosClient />
    </Suspense>
  )
}