"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { clearCart, getCart, removeFromCart, setQty, type CartItem } from "@/lib/cart"

function money(n: number) {
  return n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function CarritoPage() {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    setItems(getCart())
  }, [])

  const total = useMemo(() => items.reduce((acc, x) => acc + x.price * x.qty, 0), [items])

  if (items.length === 0) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Carrito</h1>
        <p className="text-slate-600">Tu carrito está vacío.</p>
        <Link className="inline-flex rounded-2xl bg-sky-600 px-5 py-3 font-semibold text-white" href="/productos">
          Ir a productos
        </Link>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Carrito</h1>

        <button
          className="rounded-2xl border px-4 py-2 font-semibold"
          onClick={() => {
            clearCart()
            setItems([])
          }}
        >
          Vaciar
        </button>
      </div>

      <div className="space-y-3">
        {items.map((x) => (
          <div key={x.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-white/70 p-4">
            <div className="min-w-[220px]">
              <div className="font-bold">{x.name}</div>
              <div className="text-sm text-slate-600">{x.id}</div>
              <div className="font-semibold">${money(x.price)}</div>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="h-10 w-10 rounded-xl border text-lg"
                onClick={() => {
                  const next = setQty(x.id, x.qty - 1)
                  setItems([...next])
                }}
              >
                -
              </button>

              <div className="w-10 text-center font-bold">{x.qty}</div>

              <button
                className="h-10 w-10 rounded-xl border text-lg"
                onClick={() => {
                  const next = setQty(x.id, x.qty + 1)
                  setItems([...next])
                }}
              >
                +
              </button>

              <button
                className="ml-3 rounded-xl border px-3 py-2 font-semibold"
                onClick={() => {
                  const next = removeFromCart(x.id)
                  setItems([...next])
                }}
              >
                Quitar
              </button>
            </div>

            <div className="font-bold">Subtotal: ${money(x.price * x.qty)}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-2xl border bg-white/70 p-4">
        <div className="text-lg font-bold">Total</div>
        <div className="text-xl font-black">${money(total)}</div>
      </div>

      {/* Aquí después ponemos el botón de "Generar PDF" */}
      <div className="flex gap-3">
        <Link className="rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white" href="/generar-pedido">
          Generar pedido (PDF)
        </Link>

        <Link className="rounded-2xl border px-5 py-3 font-semibold" href="/productos">
          Seguir comprando
        </Link>
      </div>
    </section>
  )
}
