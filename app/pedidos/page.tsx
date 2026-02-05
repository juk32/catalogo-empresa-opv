"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

type OrderRow = {
  id: string
  folio: string
  customerName: string
  status: "PENDIENTE" | "ENTREGADO"
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string | null
  deliveredAt?: string | null // si lo manejas
  deliveryAt?: string | null  // si tú guardas fecha/hora entrega en un solo campo
  deliveryStart?: string | null // si lo guardas por separado
  deliveryEnd?: string | null
}

function fmtDT(v?: string | null) {
  if (!v) return ""
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return ""
  return d.toLocaleString("es-MX")
}

function DeliveryText(o: OrderRow) {
  // Ajusta según tu modelo real:
  // - si guardas "deliveryAt" => úsalo
  // - si guardas "deliveryStart/end" => arma rango
  if (o.deliveryAt) return `Entrega: ${fmtDT(o.deliveryAt)}`
  if (o.deliveryStart && o.deliveryEnd) return `Entrega: ${fmtDT(o.deliveryStart)} - ${fmtDT(o.deliveryEnd)}`
  if (o.deliveryStart) return `Entrega: ${fmtDT(o.deliveryStart)}`
  return "Entrega: (sin horario)"
}

/** Modal reutilizable */
function ConfirmModal({
  open,
  title,
  message,
  confirmText = "Eliminar",
  cancelText = "Cancelar",
  loading = false,
  danger = true,
  onConfirm,
  onClose,
}: {
  open: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
  danger?: boolean
  onConfirm: () => void
  onClose: () => void
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* overlay */}
      <button
        aria-label="Cerrar modal"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* card */}
      <div className="relative w-full max-w-md rounded-3xl border bg-white p-5 shadow-[0_25px_80px_-35px_rgba(0,0,0,0.55)]">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="mt-2 text-sm text-slate-600">{message}</p>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-2xl border px-4 py-2 font-semibold hover:bg-slate-50 disabled:opacity-60"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={[
              "rounded-2xl px-4 py-2 font-semibold text-white disabled:opacity-60",
              danger ? "bg-rose-600 hover:bg-rose-700" : "bg-sky-600 hover:bg-sky-700",
            ].join(" ")}
          >
            {loading ? "Procesando..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PedidosPage() {
  const router = useRouter()
  const { data: session } = useSession()

  const [rows, setRows] = useState<OrderRow[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // modal state
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteFolio, setDeleteFolio] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function load() {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch("/api/orders", { cache: "no-store" })

      // no logueado
      if (res.status === 401) {
        const callbackUrl = encodeURIComponent("/pedidos")
        router.push(`/login?callbackUrl=${callbackUrl}`)
        return
      }

      const text = await res.text()
      let data: any = null
      try {
        data = JSON.parse(text)
      } catch {
        throw new Error(`API no devolvió JSON. Status ${res.status}`)
      }

      if (!res.ok) {
        throw new Error(data?.error || "No se pudo cargar el historial")
      }

      setRows(Array.isArray(data) ? data : [])
    } catch (e: any) {
      setRows([])
      setError(e?.message ?? "No se pudo cargar el historial")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function openPdf(id: string) {
    window.location.href = `/api/orders/${id}/pdf`
  }

  function askDelete(id: string, folio: string) {
    setDeleteId(id)
    setDeleteFolio(folio)
    setConfirmOpen(true)
  }

  async function onDeleteConfirmed() {
    if (!deleteId) return
    setDeleting(true)
    setError(null)

    try {
      const res = await fetch(`/api/orders/${deleteId}`, { method: "DELETE" })

      // no logueado
      if (res.status === 401) {
        const callbackUrl = encodeURIComponent("/pedidos")
        router.push(`/login?callbackUrl=${callbackUrl}`)
        return
      }

      const text = await res.text()
      let data: any = null
      try {
        data = JSON.parse(text)
      } catch {
        // si no hay json, igual marcamos error
      }

      if (!res.ok) {
        throw new Error(data?.error || "No se pudo eliminar")
      }

      // cerrar modal y recargar
      setConfirmOpen(false)
      setDeleteId(null)
      setDeleteFolio(null)
      await load()
    } catch (e: any) {
      setError(e?.message ?? "No se pudo eliminar")
    } finally {
      setDeleting(false)
    }
  }

  const isAdmin = (session?.user as any)?.role === "ADMIN"

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Historial de pedidos</h1>
        <Link className="rounded-2xl border px-4 py-2 font-semibold" href="/">
          Volver
        </Link>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-slate-600">Cargando...</div>
      ) : rows.length === 0 ? (
        <div className="text-slate-600">No hay pedidos.</div>
      ) : (
        <div className="space-y-4">
          {rows.map((o) => (
            <div
              key={o.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border bg-white/70 p-4"
            >
              <div className="min-w-[260px]">
                <div className="font-black">{o.folio}</div>
                <div className="text-sm text-slate-700">{o.customerName}</div>
                <div className="text-xs text-slate-500">
                  Creado por: {o.createdBy} • {fmtDT(o.createdAt)}
                  {o.updatedBy ? ` • Editado por: ${o.updatedBy} • ${fmtDT(o.updatedAt)}` : ""}
                </div>
                <div className="mt-1 text-xs text-slate-700">
                  {DeliveryText(o)}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden sm:block font-bold">
                  {o.status}
                </div>

                <button
                  onClick={() => openPdf(o.id)}
                  className="rounded-2xl border px-4 py-2 font-semibold hover:bg-slate-50"
                >
                  PDF
                </button>

                <button
                  onClick={() => router.push(`/pedidos/${o.id}`)}
                  className="rounded-2xl border px-4 py-2 font-semibold hover:bg-slate-50"
                >
                  Editar
                </button>

                {/* ✅ SOLO ADMIN */}
                {isAdmin && (
                  <button
                    onClick={() => askDelete(o.id, o.folio)}
                    className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-2 font-semibold text-rose-700 hover:bg-rose-100"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={confirmOpen}
        title="Eliminar pedido"
        message={`¿Seguro que deseas eliminar el pedido ${deleteFolio ?? ""}? Esta acción lo marcará como eliminado.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={deleting}
        danger
        onConfirm={onDeleteConfirmed}
        onClose={() => {
          if (deleting) return
          setConfirmOpen(false)
          setDeleteId(null)
          setDeleteFolio(null)
        }}
      />
    </section>
  )
}
