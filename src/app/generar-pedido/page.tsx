"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { getCart, type CartItem, clearCart } from "@/lib/cart"

function money(n: number) {
  return n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function GenerarPedidoPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [customerName, setCustomerName] = useState("")
  const [loadingSave, setLoadingSave] = useState(false)
  const [loadingPdf, setLoadingPdf] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [created, setCreated] = useState<{ id: string; folio: string } | null>(null)

  useEffect(() => {
    setItems(getCart())
  }, [])

  const total = useMemo(() => items.reduce((acc, x) => acc + x.price * x.qty, 0), [items])

  async function onSaveOrder() {
    setError(null)

    if (items.length === 0) {
      setError("Tu carrito está vacío.")
      return
    }
    if (!customerName.trim()) {
      setError("Escribe el nombre del cliente.")
      return
    }

    setLoadingSave(true)
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerName.trim(),
          items: items.map((x) => ({
            productId: x.id,
            name: x.name,
            unitPrice: x.price,
            qty: x.qty,
            unit: "PZ",
          })),
        }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(data?.error || "No se pudo guardar el pedido")
      }

      setCreated({ id: data.id, folio: data.folio })

      // ✅ Reiniciar carrito SOLO cuando el pedido ya quedó guardado
      clearCart()
      setItems([])
    } catch (e: any) {
      setError(e?.message ?? "Error al guardar pedido")
    } finally {
      setLoadingSave(false)
    }
  }

  async function onDownloadPdf() {
    if (!created) return
    setError(null)
    setLoadingPdf(true)
    try {
      const res = await fetch(`/api/orders/${created.id}/pdf`, { method: "GET" })
      if (!res.ok) {
        const t = await res.text()
        throw new Error(t || "No se pudo generar el PDF")
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${created.folio}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (e: any) {
      setError(e?.message ?? "Error al descargar PDF")
    } finally {
      setLoadingPdf(false)
    }
  }

  // Si ya no hay items porque se limpió el carrito pero ya existe created, mostramos pantalla final
  if (items.length === 0 && created) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Pedido guardado</h1>
        <div className="rounded-2xl border bg-white/70 p-4">
          <div className="font-semibold">Folio:</div>
          <div className="mt-1 font-mono text-lg">{created.folio}</div>
        </div>

        {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800">{error}</div>}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={onDownloadPdf}
            disabled={loadingPdf}
            className="rounded-2xl bg-gradient-to-r from-sky-600 to-rose-600 px-5 py-3 font-semibold text-white hover:brightness-95 disabled:opacity-60"
          >
            {loadingPdf ? "Descargando..." : "Descargar PDF"}
          </button>

          <Link className="rounded-2xl border px-5 py-3 font-semibold" href="/pedidos">
            Ver historial
          </Link>

          <Link className="rounded-2xl border px-5 py-3 font-semibold" href="/productos">
            Volver a productos
          </Link>
        </div>
      </section>
    )
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
          placeholder="Ej: Juan Pérez"
          className="mt-2 w-full rounded-xl border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-sky-300"
        />
      </div>

      {/* Items */}
      <div className="space-y-3">
        {items.map((x) => (
          <div key={x.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-white/70 p-4">
            <div>
              <div className="font-bold">{x.name}</div>
              <div className="text-sm text-slate-600">{x.id}</div>
            </div>
            <div className="text-sm">
              {x.qty} × ${money(x.price)}
            </div>
            <div className="font-bold">Subtotal: ${money(x.qty * x.price)}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-2xl border bg-white/70 p-4">
        <div className="text-lg font-bold">Total</div>
        <div className="text-xl font-black">${money(total)}</div>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
          {error}
        </div>
      )}

      {/* PASO B: Guardar primero */}
      <button
        onClick={onSaveOrder}
        disabled={loadingSave}
        className={[
          "w-full rounded-2xl px-6 py-3 font-semibold text-white",
          "bg-gradient-to-r from-sky-600 to-rose-600 hover:brightness-95",
          loadingSave ? "opacity-60" : "",
        ].join(" ")}
      >
        {loadingSave ? "Guardando pedido..." : "Guardar pedido"}
      </button>
    </section>
  )
}
