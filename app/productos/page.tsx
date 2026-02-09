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
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/products", { cache: "no-store" })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setProducts([])
        setError(data?.error || "No se pudo cargar productos")
        return
      }

      setProducts(Array.isArray(data) ? data : [])
    } catch (e: any) {
      setProducts([])
      setError(e?.message || "Error de red")
    } finally {
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
          <div className="mt-1 text-sm text-slate-600">{error}</div>
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
