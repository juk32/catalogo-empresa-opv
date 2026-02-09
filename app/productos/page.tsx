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
  stock: number
  createdAt?: string
}

function uniq(arr: string[]) {
  return Array.from(new Set(arr.filter(Boolean))).sort((a, b) => a.localeCompare(b))
}

function SkeletonCard() {
  return (
    <div className="rounded-3xl border bg-white overflow-hidden">
      <div className="h-36 sm:h-40 bg-slate-100 animate-pulse" />
      <div className="p-3 sm:p-4 space-y-3">
        <div className="h-4 w-3/4 bg-slate-100 rounded animate-pulse" />
        <div className="h-3 w-1/2 bg-slate-100 rounded animate-pulse" />
        <div className="h-3 w-full bg-slate-100 rounded animate-pulse" />
        <div className="h-9 w-full bg-slate-100 rounded-2xl animate-pulse" />
      </div>
    </div>
  )
}

export default function ProductosPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [products, setProducts] = useState<ProductRow[]>([])

  const [q, setQ] = useState("")
  const [cat, setCat] = useState<string>("Todas")
  const [onlyStock, setOnlyStock] = useState(false)

  async function load() {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 12000) // 12s

    setLoading(true)
    setError(null)

    try {
      // URL absoluta + cache buster (móvil-friendly)
      const url = `${window.location.origin}/api/products?ts=${Date.now()}`

      const res = await fetch(url, {
        cache: "no-store",
        signal: controller.signal,
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        setProducts([])
        setError((data as any)?.error || `Error HTTP ${res.status}`)
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
      clearTimeout(timeout)
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const categories = useMemo(() => ["Todas", ...uniq(products.map((p) => p.category || ""))], [products])

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    return products.filter((p) => {
      if (cat !== "Todas" && (p.category || "") !== cat) return false
      if (onlyStock && !(p.stock > 0)) return false
      if (!s) return true
      return [p.id, p.name, p.category].some((x) => (x || "").toLowerCase().includes(s))
    })
  }, [products, q, cat, onlyStock])

  return (
    <section className="space-y-6">
      {/* Header bonito */}
      <div className="rounded-3xl border bg-white/70 backdrop-blur shadow-sm overflow-hidden">
        <div className="px-4 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Productos</h1>
              <p className="mt-1 text-sm text-slate-600">Catálogo general</p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full border bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                  {loading ? "Cargando…" : `${filtered.length} producto${filtered.length === 1 ? "" : "s"}`}
                </span>

                {onlyStock && (
                  <span className="inline-flex items-center rounded-full border bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Solo disponibles
                  </span>
                )}

                {cat !== "Todas" && (
                  <span className="inline-flex items-center rounded-full border bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                    {cat}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={load}
              className="rounded-2xl border bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
            >
              Recargar
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-12">
            <div className="sm:col-span-6">
              <div className="flex items-center gap-2 rounded-2xl border bg-white px-3 py-2">
                <span className="text-slate-400 text-sm">🔎</span>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Buscar por nombre, categoría o ID…"
                  className="w-full bg-transparent text-sm outline-none"
                />
                {q && (
                  <button
                    onClick={() => setQ("")}
                    className="rounded-xl border px-2 py-1 text-xs font-semibold hover:bg-slate-50"
                    aria-label="Limpiar"
                    title="Limpiar"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div className="sm:col-span-4">
              <select
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                className="w-full rounded-2xl border bg-white px-3 py-2 text-sm"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <button
                onClick={() => setOnlyStock((v) => !v)}
                className={[
                  "w-full rounded-2xl border px-3 py-2 text-sm font-semibold",
                  onlyStock ? "bg-emerald-50 text-emerald-700" : "bg-white hover:bg-slate-50",
                ].join(" ")}
              >
                {onlyStock ? "En stock" : "Todos"}
              </button>
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>

      {/* Estados */}
      {loading ? (
        <div className="rounded-[28px] border bg-white/70 p-3 sm:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="rounded-3xl border bg-white p-6">
          <div className="font-semibold text-rose-700">No se pudieron cargar los productos</div>
          <div className="mt-2 text-sm text-slate-600 whitespace-pre-wrap">{error}</div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={load}
              className="rounded-2xl bg-black px-4 py-2 text-sm font-semibold text-white"
            >
              Reintentar
            </button>

            <a
              className="rounded-2xl border bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
              href="/api/products"
              target="_blank"
              rel="noreferrer"
            >
              Abrir API
            </a>
          </div>
        </div>
      ) : (
        <div className="rounded-[28px] border bg-white/70 p-3 shadow-sm backdrop-blur sm:p-4">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border bg-white p-6 text-sm text-slate-600">
              No hay resultados con los filtros actuales.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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
          )}
        </div>
      )}
    </section>
  )
}
