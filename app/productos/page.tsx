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
      <div className="text-amber-500 text-sm">
        {"★".repeat(s)}
        <span className="text-slate-300">{"★".repeat(5 - s)}</span>
      </div>
      <div className="text-xs text-slate-600">{Number(value || 0).toFixed(1)}</div>
    </div>
  )
}

/* =========================
   Card estilo "Hot deals" (UI only)
   - NO cambia funcionalidad
========================= */
function ProductCard({ p, i }: { p: Product; i: number }) {
  const stock = Number(p.stock ?? 0)
  const inStock = stock > 0

  // UI-only (no afecta lógica): descuento y precio "antes"
  const rating = Number(p.rating ?? 0)
  const discountPct = Math.max(10, Math.min(35, Math.round(18 + (5 - Math.min(5, Math.max(0, rating))) * 4)))
  const oldPrice = Math.round((p.price / (1 - discountPct / 100)) * 100) / 100

  return (
    <Link
      href={`/producto/${encodeURIComponent(p.id)}`}
      className="card-anim group relative block overflow-hidden rounded-3xl bg-white
                 shadow-[0_18px_50px_-25px_rgba(15,23,42,0.35)]
                 ring-1 ring-slate-200/70 transition
                 hover:-translate-y-1 hover:shadow-[0_26px_70px_-30px_rgba(15,23,42,0.45)]"
      style={{ animationDelay: `${Math.min(i * 35, 280)}ms` }}
    >
      {/* Imagen arriba */}
      <div className="relative h-44 w-full overflow-hidden">
        {/* fondo suave para que el producto resalte */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-100 to-white" />
        <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(circle_at_20%_15%,rgba(56,189,248,.22),transparent_55%),radial-gradient(circle_at_85%_75%,rgba(244,63,94,.16),transparent_55%)]" />

        {/* badge descuento */}
        <div className="absolute left-4 top-4 z-10">
          <span className="inline-flex items-center rounded-full bg-rose-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
            -{discountPct}%
          </span>
        </div>

        {/* corazón (decorativo, no cambia funcionalidad) */}
        <div className="absolute right-4 top-4 z-10">
          <div
            className="grid h-9 w-9 place-items-center rounded-full bg-white/95 ring-1 ring-slate-200/70
                       shadow-sm transition group-hover:scale-[1.03]"
            aria-hidden="true"
          >
            <span className="text-slate-700">♡</span>
          </div>
        </div>

        {/* stock pill abajo */}
        <div className="absolute left-4 bottom-4 z-10">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm ring-1 ${
              inStock
                ? "bg-emerald-50 text-emerald-800 ring-emerald-200/70"
                : "bg-slate-100 text-slate-700 ring-slate-200/70"
            }`}
          >
            {inStock ? `En stock (${stock})` : "Agotado"}
          </span>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={safeImg(p.image)}
          alt={p.name}
          className="relative z-[1] h-full w-full object-contain p-6
                     drop-shadow-[0_16px_30px_rgba(0,0,0,0.18)]
                     transition duration-300 group-hover:scale-[1.04]"
          loading="lazy"
        />
      </div>

      {/* Contenido */}
      <div className="p-5">
        {/* categoría mini */}
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-700">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-sky-50 ring-1 ring-sky-100">
            ⚡
          </span>
          <span className="truncate">{p.category || "Sin categoría"}</span>
        </div>

        <h3 className="mt-2 line-clamp-2 text-[15px] font-extrabold tracking-tight text-slate-900">
          {p.name}
        </h3>

        <p className="mt-1 text-xs text-slate-600">
          ID: <span className="font-mono">{p.id}</span>
        </p>

        <div className="mt-3 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-slate-500">Precio</p>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-black tracking-tight text-sky-700">
                ${money(p.price)}
              </div>
              <div className="text-xs text-slate-400 line-through">${money(oldPrice)}</div>
            </div>
          </div>

          <div className="shrink-0">
            <div
              className="rounded-full bg-sky-600 px-4 py-2 text-xs font-bold text-white
                         shadow-[0_10px_22px_-12px_rgba(2,132,199,0.9)]
                         transition group-hover:brightness-110"
            >
              Ver ahora
            </div>
          </div>
        </div>

        <div className="mt-3">
          <Stars value={p.rating} />
        </div>

        <p className="mt-3 line-clamp-2 text-sm text-slate-700">
          {p.description || "Sin descripción."}
        </p>
      </div>
    </Link>
  )
}

function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/70 shadow-[0_18px_50px_-25px_rgba(15,23,42,0.25)]">
      <div className="relative h-44 bg-gradient-to-b from-slate-100 to-white">
        <div className="absolute left-4 top-4 h-6 w-16 rounded-full bg-slate-200/80" />
        <div className="absolute right-4 top-4 h-9 w-9 rounded-full bg-slate-200/70" />
        <div className="absolute left-4 bottom-4 h-6 w-28 rounded-full bg-slate-200/80" />
      </div>
      <div className="p-5 space-y-3">
        <div className="h-4 w-36 rounded bg-slate-200/80" />
        <div className="h-4 w-full rounded bg-slate-200/70" />
        <div className="h-3 w-48 rounded bg-slate-200/60" />
        <div className="h-8 w-40 rounded bg-slate-200/70" />
        <div className="h-3 w-32 rounded bg-slate-200/60" />
        <div className="h-3 w-full rounded bg-slate-200/50" />
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

    return list
  }, [products, category, qDebounced])

  return (
    <section className="space-y-6">
      {/* Header + Recargar arriba */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Catálogo</h1>
          <p className="mt-1 text-slate-700">Busca por nombre, categoría o ID.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-slate-700">
            {loading ? "Cargando…" : `${filtered.length} producto${filtered.length === 1 ? "" : "s"}`}
          </div>

          <button
            onClick={load}
            className="reload-btn rounded-xl border border-white/40 bg-white/60 px-4 py-2 text-sm font-semibold text-slate-900
                       backdrop-blur transition hover:bg-white/80 active:scale-[0.98]"
          >
            <span className={`inline-block mr-2 ${reloading ? "spin" : ""}`}>🔄</span>
            Recargar
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="rounded-3xl border border-white/40 bg-white/35 p-4 shadow-[0_20px_60px_-45px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <div className="grid gap-3 md:grid-cols-[240px,1fr] md:items-center">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-2xl border border-white/45 bg-white/60 px-4 py-3 text-sm text-slate-900"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <div className="hidden md:block text-sm text-slate-700 text-right">
            Tip: usa el buscador para ID exacto o nombre.
          </div>
        </div>

        {categories.length > 2 ? (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {categories.slice(0, 12).map((c) => {
              const active = c === category
              return (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    active
                      ? "bg-slate-900 text-white border-slate-900"
                      : "border-white/45 bg-white/55 text-slate-800 hover:bg-white/70"
                  }`}
                >
                  {c}
                </button>
              )
            })}
          </div>
        ) : null}
      </div>

      {/* ✅ Search sticky (solo esto) */}
      <div className="sticky top-[68px] z-30">
        <div className="rounded-3xl border border-white/40 bg-white/35 p-3 shadow-[0_20px_60px_-45px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <div className="flex items-center gap-3 rounded-2xl border border-white/45 bg-white/60 px-4 py-3">
            <span className="text-slate-400">🔎</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nombre, categoría o ID…"
              className="w-full bg-transparent outline-none text-sm text-slate-900 placeholder:text-slate-500"
            />
            {q ? (
              <button
                className="rounded-xl border border-white/45 bg-white/60 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-white/70"
                onClick={() => setQ("")}
              >
                Limpiar
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* ✅ Spacer: evita que el sticky tape productos (SOLO móvil/tablet) */}
      <div className="h-16 sm:hidden" />

      {/* List */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-white/40 bg-white/35 p-6 text-slate-700 backdrop-blur-xl">
          No hay productos con esos filtros.
        </div>
      ) : (
        <div className="grid gap-4 pt-1 sm:pt-0 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} p={p} i={i} />
          ))}
        </div>
      )}

      {/* CSS local */}
      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(10px) scale(0.99); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .card-anim { animation: cardIn 420ms ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .card-anim { animation: none !important; }
        }

        @keyframes spinAnim { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spinAnim 650ms linear; }
      `}</style>
    </section>
  )
}
