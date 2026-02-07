"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

type OrderRow = {
  id: string
  folio: string
  customerName: string
  status: "PENDIENTE" | "ENTREGADO"
  deliveryAt: string | null
  createdAt?: string
}

export default function PedidosPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [orders, setOrders] = useState<OrderRow[]>([])

  async function load() {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch("/api/orders", { cache: "no-store" })

      if (res.status === 401) {
        const callbackUrl = encodeURIComponent("/pedidos")
        router.push(`/login?callbackUrl=${callbackUrl}`)
        return
      }

      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || "No se pudieron cargar pedidos")

      setOrders(Array.isArray(data) ? data : [])
    } catch (e: any) {
      setError(e?.message || "Error cargando pedidos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) return <div className="text-slate-600">Cargando...</div>

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Historial de pedidos</h1>
        <button onClick={load} className="rounded-2xl border px-4 py-2 font-semibold">
          Recargar
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="rounded-2xl border bg-white/70 p-4 text-slate-600">
          No hay pedidos.
        </div>
      ) : (
        <div className="rounded-2xl border bg-white/70 p-2">
          {orders.map((o) => (
            <Link
              key={o.id}
              href={`/pedidos/${o.id}`}
              className="block rounded-xl border bg-white p-4 m-2 hover:bg-slate-50"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold">{o.folio || o.id}</div>
                  <div className="text-sm text-slate-600">{o.customerName}</div>
                </div>
                <div className="text-sm font-semibold">
                  {o.status}
                </div>
              </div>

              {o.deliveryAt && (
                <div className="mt-2 text-xs text-slate-500">
                  Entrega: {new Date(o.deliveryAt).toLocaleString("es-MX")}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
