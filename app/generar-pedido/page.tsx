"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getCart, type CartItem, clearCart } from "@/lib/cart"

function money(n: number) {
  return n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function GenerarPedidoPage() {
  const router = useRouter()

  const [items, setItems] = useState<CartItem[]>([])
  const [customerName, setCustomerName] = useState("")
  const [deliveryAt, setDeliveryAt] = useState("") // datetime-local
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setItems(getCart())
  }, [])

  const total = useMemo(
    () => items.reduce((acc, x) => acc + x.price * x.qty, 0),
    [items]
  )

  async function onGeneratePdf() {
    setError(null)

    if (items.length === 0) return setError("Tu carrito está vacío.")
    if (!customerName.trim()) return setError("Escribe el nombre del cliente.")

    setLoading(true)
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerName.trim(),
          deliveryAt: deliveryAt ? new Date(deliveryAt).toISOString() : null,
          items: items.map((x) => ({
            productId: x.id,
            name: x.name,
            unitPrice: x.price,
            qty: x.qty,
            unit: "PZ",
          })),
        }),
      })

      if (res.status === 401) {
        const callbackUrl = encodeURIComponent("/generar-pedido")
        router.push(`/login?callbackUrl=${callbackUrl}`)
        return
      }

      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.error || "No se pudo generar el pedido")

      const orderId = data?.id as string | undefined
      if (!orderId) throw new Error("No se recibió el id del pedido")

      clearCart()
      setItems([])

      window.location.href = `/api/orders/${orderId}/pdf`
    } catch (e: any) {
      setError(e?.message ?? "Error al generar PDF")
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Generar pedido</h1>
        <p className="text-slate-600">No hay productos en el carrito.</p>
        <Link className="inline-flex rounded-2xl bg-sky-600 px-5 py-3 font-semibold text-white" href="/productos">
          Ir a productos
        </Link>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Generar pedido</h1>
        <Link className="rounded-2xl border px-4 py-2 font-semibold" href="/carrito">
          Volver al carrito
        </Link>
      </div>

      {/* Cliente */}
      <div className="rounded-2xl border bg-white/70 p-4">
        <label className="block text-sm font-semibold text-slate-700">Nombre del cliente</label>
        <input
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Ej. Hugo / Tienda X"
          className="mt-2 w-full rounded-xl border p-3"
        />
      </div>

      {/* ✅ Horario */}
      <div className="rounded-2xl border bg-white/70 p-4">
        <label className="block text-sm font-semibold text-slate-700">
          Establecer día y hora de entrega (opcional)
        </label>
        <input
          type="datetime-local"
          value={deliveryAt}
          onChange={(e) => setDeliveryAt(e.target.value)}
          className="mt-2 w-full rounded-xl border p-3"
        />
        <p className="mt-2 text-xs text-slate-600">
          Si lo dejas vacío, se puede asignar/editar después en historial (ADMIN).
        </p>
      </div>

      {/* Items */}
      <div className="space-y-3">
        {items.map((x) => (
          <div key={x.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-white/70 p-4">
            <div>
              <div className="font-bold">{x.name}</div>
              <div className="text-sm text-slate-600">{x.id}</div>
            </div>
            <div className="text-sm">{x.qty} × ${money(x.price)}</div>
            <div className="font-bold">Subtotal: ${money(x.qty * x.price)}</div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="flex items-center justify-between rounded-2xl border bg-white/70 p-4">
        <div className="text-lg font-bold">Total</div>
        <div className="text-xl font-black">${money(total)}</div>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
          {error}
        </div>
      )}

      <button
        onClick={onGeneratePdf}
        disabled={loading}
        className={[
          "w-full rounded-2xl px-6 py-3 font-semibold text-white",
          "bg-gradient-to-r from-sky-600 to-rose-600 hover:brightness-95",
          loading ? "opacity-60" : "",
        ].join(" ")}
      >
        {loading ? "Generando..." : "Generar PDF"}
      </button>
    </section>
  )
}
