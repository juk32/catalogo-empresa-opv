"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

type Item = {
  id?: string
  productId: string
  name: string
  unitPrice: number
  qty: number
  unit?: string
}

type OrderData = {
  id: string
  folio: string
  customerName: string
  status: "PENDIENTE" | "ENTREGADO"
  deliveryAt: string | null
  items: Item[]
}

function money(n: number) {
  return n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function Page() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const id = params.id

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [customerName, setCustomerName] = useState("")
  const [deliveryAt, setDeliveryAt] = useState("")
  const [items, setItems] = useState<Item[]>([])
  const [folio, setFolio] = useState("")

  const total = useMemo(() => items.reduce((acc, x) => acc + x.unitPrice * x.qty, 0), [items])

  async function load() {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch(`/api/orders/${id}`, { cache: "no-store" })

      if (res.status === 401) {
        const callbackUrl = encodeURIComponent(`/pedidos/${id}`)
        router.push(`/login?callbackUrl=${callbackUrl}`)
        return
      }

      const data = (await res.json()) as any
      if (!res.ok) throw new Error(data?.error || "No se pudo cargar")

      const o = data as OrderData
      setCustomerName(o.customerName || "")
      setItems(Array.isArray(o.items) ? o.items : [])
      setFolio(o.folio || "")

      if (o.deliveryAt) {
        const d = new Date(o.deliveryAt)
        const pad = (n: number) => String(n).padStart(2, "0")
        const local = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
        setDeliveryAt(local)
      } else {
        setDeliveryAt("")
      }
    } catch (e: any) {
      setError(e?.message ?? "Pedido no encontrado")
    } finally {
      setLoading(false)
    }
  }

  async function onSave() {
    setError(null)
    setSaving(true)
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerName.trim(),
          deliveryAt: deliveryAt ? new Date(deliveryAt).toISOString() : null,
          items: items.map((it) => ({ id: it.id, qty: Number(it.qty) })), // ✅ solo qty
        }),
      })

      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.error || "No se pudo guardar")

      router.refresh()
      router.push("/pedidos")
    } catch (e: any) {
      setError(e?.message ?? "Error al guardar")
    } finally {
      setSaving(false)
    }
  }

  async function onDelete() {
    if (!confirm("¿Seguro que quieres eliminar este pedido?")) return
    setError(null)
    setDeleting(true)
    try {
      const res = await fetch(`/api/orders/${id}`, { method: "DELETE" })
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.error || "No se pudo eliminar")

      router.refresh()
      router.push("/pedidos")
    } catch (e: any) {
      setError(e?.message ?? "Error al eliminar")
    } finally {
      setDeleting(false)
    }
  }

  useEffect(() => {
    if (id) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (loading) return <div className="text-slate-600">Cargando...</div>

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Editar pedido</h1>
          {folio && <div className="text-sm text-slate-600">{folio}</div>}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onDelete}
            disabled={deleting || saving}
            className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-2 font-semibold text-rose-700 disabled:opacity-50"
          >
            {deleting ? "Eliminando..." : "Eliminar"}
          </button>

          <Link className="rounded-2xl border px-4 py-2 font-semibold" href="/pedidos">
            Volver
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
          {error}
        </div>
      )}

      <div className="rounded-2xl border bg-white/70 p-4 space-y-3">
        <div>
          <label className="block text-sm font-semibold text-slate-700">Cliente</label>
          <input
            className="mt-2 w-full rounded-xl border p-3"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700">Horario de entrega (opcional)</label>
          <input
            type="datetime-local"
            className="mt-2 w-full rounded-xl border p-3"
            value={deliveryAt}
            onChange={(e) => setDeliveryAt(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-2xl border bg-white/70 p-4">
        <div className="font-bold mb-3">Productos (nombre fijo)</div>

        <div className="space-y-2">
          {items.map((it, idx) => (
            <div key={`${it.productId}-${idx}`} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white p-3">
              <div>
                <div className="font-semibold">{it.name}</div>
                <div className="text-xs text-slate-600">{it.productId}</div>
                <div className="text-xs text-slate-500">Precio congelado: ${money(it.unitPrice)}</div>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-600">Qty</label>
                <input
                  type="number"
                  min={1}
                  className="w-20 rounded-lg border p-2"
                  value={it.qty}
                  onChange={(e) => {
                    const v = Number(e.target.value)
                    setItems((prev) => prev.map((x, i) => (i === idx ? { ...x, qty: v } : x)))
                  }}
                />
              </div>

              <div className="font-bold">${money(it.unitPrice * it.qty)}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between rounded-xl border bg-white p-3">
          <div className="font-bold">Total</div>
          <div className="font-black text-lg">${money(total)}</div>
        </div>
      </div>

      <button
        onClick={onSave}
        disabled={saving || deleting}
        className={[
          "w-full rounded-2xl px-6 py-3 font-semibold text-white",
          "bg-gradient-to-r from-sky-600 to-rose-600 hover:brightness-95",
          saving ? "opacity-60" : "",
        ].join(" ")}
      >
        {saving ? "Guardando..." : "Guardar cambios"}
      </button>
    </section>
  )
}
