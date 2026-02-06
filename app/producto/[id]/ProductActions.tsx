"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

type Item = {
  id: string
  name: string
  price: number
  image?: string
  category?: string
  stock: number
}

type CartItem = {
  id: string
  name: string
  price: number
  image?: string
  category?: string
  qty: number
}

export default function ProductActions({ product }: { product: Item }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  function addToCart() {
    if (product.stock <= 0) {
      alert("Este producto no tiene stock")
      return
    }

    setLoading(true)
    try {
      const raw = localStorage.getItem("cart_v1")
      const cart: CartItem[] = raw ? JSON.parse(raw) : []

      const idx = cart.findIndex((x) => x.id === product.id)
      if (idx >= 0) cart[idx].qty += 1
      else cart.push({ ...product, qty: 1 })

      localStorage.setItem("cart_v1", JSON.stringify(cart))
      router.push("/carrito")
    } catch {
      alert("No se pudo agregar al carrito")
    } finally {
      setLoading(false)
    }
  }

  function goToGenerarPedido() {
    router.push("/generar_pedido")
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        onClick={addToCart}
        disabled={loading || product.stock <= 0}
        className="rounded-2xl bg-gradient-to-r from-sky-600 to-rose-600 px-5 py-3 text-sm font-semibold text-white shadow hover:brightness-95 disabled:opacity-50"
      >
        {loading ? "Agregando..." : "Ordenar"}
      </button>

      <button
        type="button"
        onClick={goToGenerarPedido}
        className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold shadow hover:bg-slate-50"
      >
        Generar pedido
      </button>
    </div>
  )
}
