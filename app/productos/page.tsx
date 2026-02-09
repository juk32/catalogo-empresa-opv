"use client"

import { useEffect, useMemo, useState } from "react"
import ProductCard3D from "./ProductCard3D"

type ProductRow = {
  id: string
  name: string
  price: number
  category: string
  image: string
  description: string
  details: any
  rating: number
  stock: number
  createdAt?: string
}

export default function ProductosPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [products, setProducts] = useState<ProductRow[]>([])
  const [q, setQ] = useState("")

  async function load() {
    const controller = new AbortController()
    const t = setTimeout(() => controller.abort(), 15000) // 15s timeout

    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/products", {
        cache: "no-store",
        signal: controller.signal,
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        const msg = (data as any)?.error || `Error HTTP ${res.status}`
        setProducts([])
        setError(msg)
        return
      }

      if (!Array.isArray(data)) {
        setProducts([])
        setError("La API no devolvió un arreglo de productos.")
        return
      }

      setProducts(data as ProductRow[])
    } catch (e: any) {
      console.error("ERROR fetch /api/products:", e)
      setProducts([])
      setError(
        e?.name === "AbortError"
          ? "La carga tardó demasiado (timeout)."
          : e?.message || "Error de red"
      )
    } finally {
      clearTimeout(t)
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return products
    return products.filter((p) =>
      [p.id, p.name, p.category].some((x) => (x || "").toLowerCase().includes(s))
    )
  }, [products, q])

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Productos</h1>
          <p className="mt-1 text-slate-600">Catálogo general</p>
        </div>

        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nombre, categoría o ID…"
            className="w-full max-w-xs rounded-2xl border bg-white px-4 py-2 text-sm outline-none"
          />

          <button
            onClick={load}
            className="rounded-2xl border bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
          >
            Recargar
          </button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border bg-white p-6">Cargando productos…</div>
      ) : error ? (
        <div className="rounded-2xl border bg-white p-6">
          <div className="font-semibold text-rose-700">No se pudo cargar</div>
          <div className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">{error}</div>
          <button
            onClick={load}
            className="mt-4 rounded-2xl bg-black px-4 py-2 text-sm font-semibold text-white"
          >
            Reintentar
          </button>
        </div>
      ) : (
        <>
          <div className="text-xs text-slate-500">
            {filtered.length} producto{filtered.length === 1 ? "" : "s"}
          </div>

          <div className="rounded-[28px] border bg-white/70 p-3 shadow-sm backdrop-blur sm:p-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {filtered.map((p) => (
                <ProductCard3D
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  category={p.category}
                  image={p.image}
                  description={p.description}
                  price={p.price}
                  stock={p.stock}
                  href={`/producto/${p.id}`}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  )
}
