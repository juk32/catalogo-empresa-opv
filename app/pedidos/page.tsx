"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type OrderRow = {
  id: string
  folio: string
  customerName: string
  status: "PENDIENTE" | "ENTREGADO"
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy?: string | null
}

export default function PedidosPage() {
  const [rows, setRows] = useState<OrderRow[]>([])
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setError(null)
    const res = await fetch("/api/orders")
    const data = await res.json().catch(() => null)
    if (!res.ok) {
      setError(data?.error ?? "No se pudo cargar")
      return
    }
    setRows(data)
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Historial de pedidos</h1>
        <Link className="rounded-2xl border px-4 py-2 font-semibold" href="/productos">
          Volver
        </Link>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
          {error}
        </div>
      )}

      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.id} className="rounded-2xl border bg-white/70 p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-bold">{r.folio}</div>
              <div className="text-sm text-slate-600">{r.customerName}</div>
              <div className="text-xs text-slate-500">Creado por: {r.createdBy}</div>
              {r.updatedBy && <div className="text-xs text-slate-500">Editado por: {r.updatedBy}</div>}
            </div>

            <div className="font-semibold">{r.status}</div>

            <div className="flex gap-2">
              <a className="rounded-xl border px-3 py-2 text-sm font-semibold" href={`/api/orders/${r.id}/pdf`} target="_blank">
                PDF
              </a>
              <Link className="rounded-xl border px-3 py-2 text-sm font-semibold" href={`/pedidos/${r.id}`}>
                Editar
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
