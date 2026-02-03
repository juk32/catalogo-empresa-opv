"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

type OrderRow = {
  id: string
  folio: string
  customerName: string
  status: "PENDIENTE" | "ENTREGADO"
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string | null
}

type MeResponse =
  | { user: null }
  | { user: { name: string; role: "ADMIN" | "VENDEDOR" | string | null } }

function formatDateTime(iso: string) {
  try {
    return new Date(iso).toLocaleString("es-MX")
  } catch {
    return iso
  }
}

export default function PedidosPage() {
  const [rows, setRows] = useState<OrderRow[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(null)

  const router = useRouter()

  async function loadMe() {
    try {
      const res = await fetch("/api/me", { cache: "no-store" })
      const data = (await res.json()) as MeResponse
      setRole(data.user?.role ?? null)
    } catch {
      setRole(null)
    }
  }

  async function loadOrders() {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch("/api/orders", { cache: "no-store" })
      const data = await res.json().catch(() => null)

      if (!res.ok) {
        setError(data?.error || "No se pudo cargar el historial")
        return
      }
      setRows(data as OrderRow[])
    } catch (e: any) {
      setError(e?.message || "Error al cargar")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMe()
    loadOrders()
  }, [])

  async function onDelete(id: string) {
    setError(null)

    const ok = confirm("¿Seguro que quieres eliminar este pedido?")
    if (!ok) return

    setDeletingId(id)
    try {
      const res = await fetch(`/api/orders/${id}`, { method: "DELETE" })
      const data = await res.json().catch(() => null)

      if (!res.ok) {
        setError(data?.error || "No se pudo eliminar")
        return
      }

      setRows((prev) => prev.filter((x) => x.id !== id))
      router.refresh()
    } catch (e: any) {
      setError(e?.message || "Error al eliminar")
    } finally {
      setDeletingId(null)
    }
  }

  const isAdmin = role === "ADMIN"

  return (
    <section className="space-y-6">
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

      {loading ? (
        <div className="text-slate-600">Cargando…</div>
      ) : rows.length === 0 ? (
        <div className="text-slate-600">No hay pedidos.</div>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <div
              key={r.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-white/70 p-4"
            >
              <div className="min-w-[240px]">
                <div className="font-black">{r.folio}</div>
                <div className="text-sm text-slate-700">{r.customerName}</div>
                <div className="text-xs text-slate-500">
                  Creado por: {r.createdBy} • {formatDateTime(r.createdAt)}
                  {r.updatedBy ? ` • Editado por: ${r.updatedBy} • ${formatDateTime(r.updatedAt)}` : ""}
                </div>
              </div>

              <div className="font-bold">{r.status}</div>

              <div className="flex items-center gap-2">
                <a
                  className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                  href={`/api/orders/${r.id}/pdf`}
                  target="_blank"
                  rel="noreferrer"
                >
                  PDF
                </a>

                <Link
                  className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                  href={`/pedidos/${r.id}`}
                >
                  Editar
                </Link>

                {isAdmin && (
                  <button
                    onClick={() => onDelete(r.id)}
                    disabled={deletingId === r.id}
                    className={[
                      "rounded-xl border px-4 py-2 text-sm font-semibold",
                      "border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100",
                      deletingId === r.id ? "opacity-60" : "",
                    ].join(" ")}
                    title="Eliminar (solo ADMIN)"
                  >
                    {deletingId === r.id ? "Eliminando…" : "Eliminar"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
