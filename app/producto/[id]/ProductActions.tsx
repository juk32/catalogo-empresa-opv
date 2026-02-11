"use client"

import { useMemo, useState } from "react"
import { addToCart } from "@/lib/cart"

type ProductForAction = {
  id: string
  name: string
  price: number
  image: string | null
  category: string
  stock: number | null
}

function clampQty(n: number) {
  const v = Math.floor(Number(n) || 1)
  return Math.max(1, Math.min(999, v))
}

export default function ProductActions({
  product,
  hideGenerate = false,
  generateHref = "/generar-pedido",
  quickOrder = false, // si true: Ordenar también te manda a /generar-pedido
}: {
  product: ProductForAction
  hideGenerate?: boolean
  generateHref?: string
  quickOrder?: boolean
}) {
  const [qty, setQty] = useState(1)
  const [toast, setToast] = useState<{ show: boolean; text: string; kind: "ok" | "err" }>({
    show: false,
    text: "",
    kind: "ok",
  })

  const stock = useMemo(() => {
    const n = Number(product.stock ?? 0)
    return Number.isFinite(n) ? n : 0
  }, [product.stock])

  const inStock = stock > 0

  function showToast(text: string, kind: "ok" | "err" = "ok") {
    setToast({ show: true, text, kind })
    window.setTimeout(() => setToast((t) => ({ ...t, show: false })), 1600)
  }

  function add() {
    if (!inStock) {
      showToast("Producto sin stock", "err")
      return false
    }

    // ✅ USA TU CARRITO REAL (cart_v1)
    addToCart(
      { id: product.id, name: product.name, price: Number(product.price || 0) },
      clampQty(qty)
    )

    // ✅ evento para que el navbar/carrito refresque si lo escuchas
    window.dispatchEvent(new Event("cart_v1_updated"))

    showToast("Agregado al carrito ✅", "ok")
    return true
  }

  function onOrdenar(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    e.stopPropagation()
    const ok = add()
    if (ok && quickOrder) window.location.assign(generateHref)
  }

  function onGenerarPedido(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    e.stopPropagation()
    const ok = add()
    if (ok) window.location.assign(generateHref)
  }

  return (
    <div className="space-y-3">
      {/* Toast glass bonito */}
      <div
        className={`pointer-events-none fixed left-1/2 top-5 z-[9999] -translate-x-1/2 transition-all duration-200
        ${toast.show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
        aria-live="polite"
      >
        <div
          className={`rounded-2xl px-4 py-2 text-sm font-semibold backdrop-blur-xl ring-1 shadow-[0_18px_45px_-25px_rgba(0,0,0,.55)]
          ${
            toast.kind === "ok"
              ? "bg-emerald-50/70 text-emerald-900 ring-emerald-200/60"
              : "bg-rose-50/70 text-rose-900 ring-rose-200/60"
          }`}
        >
          {toast.text}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center rounded-2xl bg-white/55 ring-1 ring-white/45 backdrop-blur overflow-hidden">
          <button
            type="button"
            onClick={() => setQty((q) => clampQty(q - 1))}
            className="px-3 py-2 text-sm font-bold text-slate-800 hover:bg-white/60 active:scale-[0.99]"
            aria-label="Disminuir cantidad"
          >
            –
          </button>

          <input
            value={qty}
            onChange={(e) => setQty(clampQty(Number(e.target.value)))}
            className="w-16 bg-transparent text-center text-sm font-semibold text-slate-900 outline-none"
            inputMode="numeric"
            aria-label="Cantidad"
          />

          <button
            type="button"
            onClick={() => setQty((q) => clampQty(q + 1))}
            className="px-3 py-2 text-sm font-bold text-slate-800 hover:bg-white/60 active:scale-[0.99]"
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>

        <span className="text-xs font-semibold text-slate-700">
          {inStock ? `Disponible: ${stock}` : "Sin stock"}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onOrdenar}
          disabled={!inStock}
          className={`rounded-2xl px-4 py-2 text-sm font-semibold text-white
            shadow-[0_14px_26px_-18px_rgba(0,0,0,.8)]
            transition hover:-translate-y-0.5 hover:shadow-[0_20px_34px_-22px_rgba(0,0,0,.9)]
            active:translate-y-0 active:scale-[0.99]
            ${inStock ? "bg-gradient-to-b from-slate-900 to-slate-800" : "bg-slate-400 cursor-not-allowed"}`}
        >
          Ordenar
        </button>

        {!hideGenerate && (
          <button
            type="button"
            onClick={onGenerarPedido}
            disabled={!inStock}
            aria-label="Generar pedido"
            className={`rounded-2xl px-4 py-2 text-sm font-semibold
              ring-1 ring-white/45 backdrop-blur
              transition hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]
              ${inStock ? "bg-white/55 text-slate-900 hover:bg-white/65" : "bg-white/40 text-slate-500 cursor-not-allowed"}`}
          >
            Generar pedido
          </button>
        )}
      </div>

      <p className="text-[11px] text-slate-600">
        * “Ordenar” agrega al carrito. “Generar pedido” te lleva al flujo de pedido.
      </p>
    </div>
  )
}
