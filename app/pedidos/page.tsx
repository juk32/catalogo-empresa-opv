import { Suspense } from "react"
import PedidosClient from "./PedidosClient"

export const runtime = "nodejs"

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-slate-600">Cargando pedidos…</div>}>
      <PedidosClient />
    </Suspense>
  )
}