"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { getCart, type CartItem } from "@/lib/cart"

function money(n: number) {
  return n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function GenerarPedidoPage() {
  const [items, setItems] = useState<CartItem[]>([])
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

    if (items.length === 0) {
      setError("Tu carrito está vacío.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/pedido/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((x) => ({
            id: x.id,
            name: x.name,
            price: x.price,
            qty: x.qty,
          })),
          total,
        }),
      })

      if (!res.ok) {
        const t = await res.text()
        throw new Error(t || "No se pudo generar el PDF")
      }

      // Recibir PDF y descargar
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `pedido-${Date.now()}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
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

      <button
        onClick={onGeneratePdf}
        disabled={loading}
        className={[
          "w-full rounded-2xl px-6 py-3 font-semibold text-white",
          "bg-gradient-to-r from-sky-600 to-rose-600 hover:brightness-95",
          loading ? "opacity-60" : "",
        ].join(" ")}
      >
        {loading ? "Generando PDF..." : "Generar PDF"}
      </button>
    </section>
  )
}
