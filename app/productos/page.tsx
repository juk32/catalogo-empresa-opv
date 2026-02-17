"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"

type Product = {
  id: string
  name: string
  price: number
  category: string
  image: string
  description: string
  details: any
  rating: number
  stock: number
}

function money(n: number) {
  return n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function safeImg(src?: string) {
  if (!src) return "/placeholder.png"
  if (src.startsWith("/") || src.startsWith("http")) return src
  return "/placeholder.png"
}

function clampStars(n: number) {
  const v = Math.round(Number(n) || 0)
  return Math.max(0, Math.min(5, v))
}

function Stars({ value }: { value: number }) {
  const s = clampStars(value)
  return (
    <div className="flex items-center gap-2">
      <div className="text-amber-500 text-sm leading-none">
        {"★".repeat(s)}
        <span className="text-slate-300">{s < 5 ? "★".repeat(5 - s) : ""}</span>
      </div>
      <div className="text-xs text-slate-600">{Number(value || 0).toFixed(1)}</div>
    </div>
  )
}

/* =========================
   Card estilo "Amazon Pro"
   - No cambia funcionalidad
   - Solo UI
========================= */
function ProductCard({ p, i }: { p: Product; i: number }) {
  const stock = Number(p.stock ?? 0)
  const inStock = stock > 0

  // UI-only: descuento / precio antes (igual que tú)
  const rating = Number(p.rating ?? 0)
  const discountPct = Math.max(10, Math.min(35, Math.round(18 + (5 - Math.min(5, Math.max(0, rating))) * 4)))
  const oldPrice = Math.round((p.price / (1 - discountPct / 100)) * 100) / 100

  // UI-only: conteo de reseñas (se ve Amazon)
  const reviews = Math.max(8, Math.min(1400, Math.round(60 + rating * 220 + (i % 9) * 37)))

  return (
    <Link
      href={`/producto/${encodeURIComponent(p.id)}`}
      className="group relative block overflow-hidden rounded-2xl border border-slate-200 bg-white
                 shadow-sm transition hover:-translate-y-[2px] hover:shadow-md"
      style={{ animationDelay: `${Math.min(i * 25, 220)}ms` }}
    >
      {/* Top: imagen */}
      <div className="relative">
        <div className="aspect-[4/3] w-full bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={safeImg(p.image)}
            alt={p.name}
            className="h-full w-full object-contain p-5 transition-transform duration-200 group-hover:scale-[1.03]"
            loading="lazy"
          />
        </div>

        {/* Descuento */}
        <div className="absolute left-3 top-3">
          <span className="rounded-full bg-rose-600 px-2.5 py-1 text-[11px] font-extrabold text-white shadow-sm">
            -{discountPct}%
          </span>
        </div>

        {/* Stock */}
        <div className="absolute right-3 top-3">
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm border ${
              inStock
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            {inStock ? `En stock (${stock})` : "Agotado"}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Categoría */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold text-sky-700">
            {p.category || "Sin categoría"}
          </span>
          <span className="text-[11px] text-slate-500 font-mono">{p.id}</span>
        </div>

        {/* Título */}
        <h3 className="mt-2 line-clamp-2 text-[15px] font-semibold text-slate-900 group-hover:text-sky-700">
          {p.name}
        </h3>

        {/* Rating + reseñas */}
        <div className="mt-2 flex items-center gap-2">
          <Stars value={p.rating} />
          <span className="text-xs text-slate-500">({reviews.toLocaleString("es-MX")})</span>
        </div>

        {/* Precio */}
        <div className="mt-3 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] text-slate-500">Precio</p>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-extrabold tracking-tight text-slate-900">
                ${money(p.price)}
              </div>
              <div className="text-xs text-slate-400 line-through">${money(oldPrice)}</div>
            </div>

            {/* Texto tipo Amazon */}
            <p className="mt-1 text-xs text-slate-600">
              {inStock ? "Entrega rápida disponible" : "Sin disponibilidad"}
            </p>
          </div>

          {/* CTA */}
          <div className="shrink-0">
            <div className="rounded-full bg-sky-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition group-hover:bg-sky-700">
              Ver →
            </div>
          </div>
        </div>

        {/* Descripción */}
        <p className="mt-3 line-clamp-2 text-sm text-slate-600">
          {p.description || "Sin descripción."}
        </p>
      </div>
    </Link>
  )
}

function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="aspect-[4/3] bg-slate-100" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-24 rounded bg-slate-200" />
        <div className="h-4 w-full rounded bg-slate-200" />
        <div className="h-3 w-40 rounded bg-slate-200" />
        <div className="h-7 w-44 rounded bg-slate-200" />
        <div className="h-3 w-full rounded bg-slate-200" />
      </div>
    </div>
  )
}

export default function ProductosPage() {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])

  const [q, setQ] = useState("")
  const [qDebounced, setQDebounced] = useState("")
  const [category, setCategory] = useState("Todas")

  // ✅ Amazon pro: ordenamiento
  const [sort, setSort] = useState<"relevance" | "price_asc" | "price_desc" | "rating_desc" | "stock_desc">(
    "relevance"
  )

  const [reloading, setReloading] = useState(false)

  async function load() {
    setLoading(true)
    setReloading(true)
    try {
      const res = await fetch("/api/products", { cache: "no-store" })
      const data = await res.json().catch(() => ([] as Product[]))
      if (!res.ok) {
        setProducts([])
        return
      }
      setProducts(data as Product[])
    } finally {
      setLoading(false)
      window.setTimeout(() => setReloading(false), 350)
    }
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    const t = window.setTimeout(() => setQDebounced(q.trim().toLowerCase()), 250)
    return () => window.clearTimeout(t)
  }, [q])

  const categories = useMemo(() => {
    const set = new Set<string>()
    for (const p of products) if (p.category) set.add(p.category)
    return ["Todas", ...Array.from(set).sort((a, b) => a.localeCompare(b))]
  }, [products])

  const filtered = useMemo(() => {
    let list = products

    if (category !== "Todas") {
      list = list.filter((p) => (p.category || "").toLowerCase() === category.toLowerCase())
    }

    if (qDebounced) {
      list = list.filter((p) =>
        [p.id, p.name, p.category]
          .filter(Boolean)
          .some((x) => String(x).toLowerCase().includes(qDebounced))
      )
    }

    // ✅ Ordenamiento Amazon pro
    switch (sort) {
      case "price_asc":
        list = [...list].sort((a, b) => Number(a.price || 0) - Number(b.price || 0))
        break
      case "price_desc":
        list = [...list].sort((a, b) => Number(b.price || 0) - Number(a.price || 0))
        break
      case "rating_desc":
        list = [...list].sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0))
        break
      case "stock_desc":
        list = [...list].sort((a, b) => Number(b.stock || 0) - Number(a.stock || 0))
        break
      default:
        break
    }

    return list
  }, [products, category, qDebounced, sort])

  return (
    <section className="relative space-y-5">
      {/* Fondo blanco (Amazon store feel) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute -top-40 left-1/2 h-[520px] w-[980px] -translate-x-1/2 rounded-full bg-sky-200/35 blur-[140px]" />
      </div>

      {/* Header Amazon Pro */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Catálogo</h1>
          <p className="mt-1 text-slate-600">Busca por nombre, categoría o ID.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="text-sm text-slate-600">
            {loading ? "Cargando…" : `${filtered.length} producto${filtered.length === 1 ? "" : "s"}`}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Ordenar:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm"
            >
              <option value="relevance">Relevancia</option>
              <option value="price_asc">Precio: menor</option>
              <option value="price_desc">Precio: mayor</option>
              <option value="rating_desc">Mejor calificados</option>
              <option value="stock_desc">Más stock</option>
            </select>
          </div>

          <button
            onClick={load}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900
                       shadow-sm hover:bg-slate-50 transition active:scale-[0.98]"
          >
            <span className={`inline-block mr-2 ${reloading ? "spin" : ""}`}>🔄</span>
            Recargar
          </button>
        </div>
      </div>

      {/* Filtros (compacto tipo Amazon) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[260px,1fr] md:items-center">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <div className="hidden md:block text-sm text-slate-500 text-right">
            Tip: usa el buscador para ID exacto o nombre.
          </div>
        </div>

        {categories.length > 2 ? (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {categories.slice(0, 14).map((c) => {
              const active = c === category
              return (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    active
                      ? "bg-slate-900 text-white border-slate-900"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {c}
                </button>
              )
            })}
          </div>
        ) : null}
      </div>

      {/* Search sticky (Amazon-style: siempre a mano) */}
      <div className="sticky top-[72px] z-30">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
            <span className="text-slate-400">🔎</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nombre, categoría o ID…"
              className="w-full bg-transparent outline-none text-sm text-slate-900 placeholder:text-slate-400"
            />
            {q ? (
              <button
                className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                onClick={() => setQ("")}
              >
                Limpiar
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
          No hay productos con esos filtros.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} p={p} i={i} />
          ))}
        </div>
      )}

      {/* CSS local */}
      <style>{`
        @keyframes spinAnim { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spinAnim 650ms linear; }
      `}</style>
    </section>
  )
}
