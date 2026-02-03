"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

type OrderItem = {
  id: string
  productId: string
  name: string
  unitPrice: number
  qty: number
  unit: string
}

type Order = {
  id: string
  folio: string
  customerName: string
  status: "PENDIENTE" | "ENTREGADO"
  items: OrderItem[]
}

function money(n: number) {
  return n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function EditPedidoPage() {
  const params = useParams() as { id?: string }
  const id = params?.id
  const router = useRouter()

  const [order, setOrder] = useState<Order | null>(null)
  const [customerName, setCustomerName] = useState("")
  const [items, setItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    if (!id) return
    setError(null)
    const res = await fetch(`/api/orders/${id}`, { cache: "no-store" })
    const data = await res.json().catch(() => null)
    if (!res.ok) {
      setError(data?.error || "Pedido no encontrado")
      setOrder(null)
      return
    }
    setOrder(data)
    setCustomerName(data.customerName || "")
    setItems(data.items || [])
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const total = useMemo(
    () => items.reduce((acc, it) => acc + it.unitPrice * it.qty, 0),
    [items]
  )

  function setQtyLocal(itemId: string, qty: number) {
    setItems((prev) =>
      prev.map((x) => (x.id === itemId ? { ...x, qty: Math.max(0, qty) } : x)).filter((x) => x.qty > 0)
    )
  }

  async function onSave() {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          items: items.map((it) => ({
            productId: it.productId,
            name: it.name,
            unitPrice: it.unitPrice,
            qty: it.qty,
            unit: it.unit,
          })),
        }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.error || "No se pudo guardar")

      await load()
      router.refresh()
    } catch (e: any) {
      setError(e?.message ?? "Error al guardar")
    } finally {
      setLoading(false)
    }
  }

  async function onPdf() {
    if (!id) return
    window.open(`/api/orders/${id}/pdf`, "_blank")
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">
          Editar pedido {order?.folio ? order.folio : ""}
        </h1>
        <Link className="rounded-2xl border px-4 py-2 font-semibold" href="/pedidos">
          Volver
        </Link>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
          {error}
        </div>
      )}

      {!order ? (
        <div className="rounded-2xl border bg-white/70 p-4">Pedido no encontrado</div>
      ) : (
        <>
          <div className="rounded-2xl border bg-white/70 p-4 space-y-3">
            <label className="block text-sm font-semibold">Cliente</label>
            <input
              className="w-full rounded-xl border p-3"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Nombre del cliente"
            />
          </div>

          <div className="rounded-2xl border bg-white/70 p-4 space-y-3">
            <div className="font-bold">Productos</div>

            {items.map((it) => (
              <div key={it.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white p-3">
                <div>
                  <div className="font-semibold">{it.name}</div>
                  <div className="text-xs text-slate-600">{it.productId}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="rounded-xl border px-3 py-2"
                    onClick={() => setQtyLocal(it.id, it.qty - 1)}
                  >
                    -
                  </button>
                  <input
                    className="w-20 rounded-xl border p-2 text-center"
                    value={it.qty}
                    onChange={(e) => setQtyLocal(it.id, Number(e.target.value || 0))}
                  />
                  <button
                    className="rounded-xl border px-3 py-2"
                    onClick={() => setQtyLocal(it.id, it.qty + 1)}
                  >
                    +
                  </button>
                </div>

                <div className="text-sm">
                  ${money(it.unitPrice)} c/u • <b>${money(it.unitPrice * it.qty)}</b>
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <div className="text-slate-600">No hay productos.</div>
            )}
          </div>

          <div className="flex items-center justify-between rounded-2xl border bg-white/70 p-4">
            <div className="text-lg font-bold">Total</div>
            <div className="text-xl font-black">${money(total)}</div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={onSave}
              disabled={loading}
              className={[
                "rounded-2xl px-6 py-3 font-semibold text-white",
                "bg-gradient-to-r from-sky-600 to-rose-600 hover:brightness-95",
                loading ? "opacity-60" : "",
              ].join(" ")}
            >
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>

            <button
              onClick={onPdf}
              className="rounded-2xl border bg-white/70 px-6 py-3 font-semibold"
            >
              PDF
            </button>
          </div>
        </>
      )}
    </section>
  )
}
