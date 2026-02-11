"use client"
"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"

type ProductForAction = {
  id: string
  name: string
  price: number
  image: string | null
  category: string
  stock: number | null
}

type CartItem = {
  productId: string
  name: string
  unitPrice: number
  qty: number
  image?: string | null
  category?: string
}

function clampQty(n: number) {
  const v = Math.floor(Number(n) || 1)
  return Math.max(1, Math.min(999, v))
}

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem("opb_cart")
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeCart(items: CartItem[]) {
  localStorage.setItem("opb_cart", JSON.stringify(items))
  // por si tienes un badge/contador en navbar
  window.dispatchEvent(new Event("opb_cart_updated"))
}

// ✅ intenta ir a la ruta principal; si falla, intenta fallback
async function goTo(router: ReturnType<typeof useRouter>, href: string, fallback?: string) {
  try {
    // router.push no avisa si 404, pero al menos dejamos un fallback manual
    router.push(href)
  } catch {
    if (fallback) router.push(fallback)
  }
}

export default function ProductActions({
  product,
  hideGenerate = false,

  // ✅ TU ruta real aquí (si tu página es /pedido, cámbialo a "/pedido")
  orderHref = "/generar-pedido",

  // ✅ si en tu proyecto la ruta real es otra, ponla como fallback
  orderHrefFallback = "/pedido",

  // ✅ si quieres que "Ordenar" también redirija, pon true donde lo uses
  quickOrder = false,
}: {
  product: ProductForAction
  hideGenerate?: boolean

  // rutas (adaptables)
  orderHref?: string
  orderHrefFallback?: string

  // comportamiento
  quickOrder?: boolean
}) {
  const router = useRouter()
  const [qty, setQty] = useState(1)

  const inStock = useMemo(() => (product.stock ?? 0) > 0, [product.stock])

  function addToCart() {
    if (!inStock) return

    const items = readCart()
    const idx = items.findIndex((x) => x.productId === product.id)
    const add = clampQty(qty)

    if (idx >= 0) {
      items[idx] = {
        ...items[idx],
        qty: clampQty(items[idx].qty + add),
      }
    } else {
      items.push({
        productId: product.id,
        name: product.name,
        unitPrice: product.price,
        qty: add,
        image: product.image,
        category: product.category,
      })
    }

    writeCart(items)
  }

  function onOrdenar() {
    addToCart()
    if (quickOrder) {
      void goTo(router, orderHref, orderHrefFallback)
    }
  }

  function onGenerarPedido() {
    if (inStock) addToCart()
    void goTo(router, orderHref, orderHrefFallback)
  }

  return (
    <div className="space-y-3">
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
          {inStock ? `Disponible: ${product.stock ?? 0}` : "Sin stock"}
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
