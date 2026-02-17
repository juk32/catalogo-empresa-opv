"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

type CartItem = {
  productId: string
  name: string
  unitPrice: number
  qty: number
  unit?: string
}

const KEY = "opb_cart"

function isBrowser() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined"
}

function readCartSafe(): CartItem[] {
  if (!isBrowser()) return []
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as CartItem[]) : []
  } catch {
    return []
  }
}

function writeCartSafe(items: CartItem[]) {
  if (!isBrowser()) return
  try {
    localStorage.setItem(KEY, JSON.stringify(items ?? []))
    window.dispatchEvent(new Event("opb_cart_updated"))
  } catch {
    // noop
  }
}

export default function GeneratePedidoButton({
  productId,
  name,
  unitPrice,
  unit,
  qty = 1,
  className,
  children,
}: {
  productId: string
  name: string
  unitPrice: number
  unit?: string
  qty?: number
  className?: string
  children?: React.ReactNode
}) {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    // ✅ solo cliente
    setCart(readCartSafe())
  }, [])

  const item: CartItem = useMemo(
    () => ({
      productId,
      name,
      unitPrice,
      qty,
      unit,
    }),
    [productId, name, unitPrice, qty, unit]
  )

  function addAndGo() {
    const next = [...cart]
    const idx = next.findIndex((x) => x.productId === item.productId)

    if (idx >= 0) {
      next[idx] = { ...next[idx], qty: (Number(next[idx].qty) || 0) + (Number(item.qty) || 1) }
    } else {
      next.push(item)
    }

    setCart(next)
    writeCartSafe(next)

    // ✅ navegación solo cliente
    router.push("/generar-pedido?quick=1")
  }

  return (
    <button
      type="button"
      onClick={addAndGo}
      className={
        className ??
        "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition"
      }
    >
      {children ?? "Generar pedido"}
    </button>
  )
}
