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
   Animación ligera (tablet/móvil friendly)
========================= */
function ProductCard({ p, i }: { p: Product; i: number }) {
  const stock = Number(p.stock ?? 0)
  const inStock = stock > 0

  return (
    <Link
      href={`/producto/${encodeURIComponent(p.id)}`}
      className="card-anim group relative block overflow-hidden rounded-3xl border border-white/40 bg-white/35
                 shadow-[0_30px_80px_-55px_rgba(0,0,0,0.7)]
                 backdrop-blur-xl transition
                 hover:-translate-y-1 hover:shadow-[0_40px_110px_-70px_rgba(0,0,0,0.8)]"
      style={{ animationDelay: `${Math.min(i * 35, 280)}ms` }}
    >
      {/* glow */}
      <div className="pointer-events-none absolute -top-16 -left-16 h-40 w-40 rounded-full bg-sky-400/18 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-rose-400/12 blur-3xl" />

      <div className="relative p-4">
        {/* Top */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-slate-900">{p.name}</h3>
            <p className="mt-0.5 truncate text-xs text-slate-600">{p.category}</p>
          </div>

          <span
            className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur
            ${
              inStock
                ? "border-emerald-200/60 bg-emerald-50/60 text-emerald-800"
                : "border-slate-200/70 bg-white/50 text-slate-700"
            }`}
          >
            {inStock ? `En stock (${stock})` : "Agotado"}
          </span>
        </div>

        {/* ✅ Image (MEJORADA) */}
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/45 bg-white/60">
          <div className="relative h-44 w-full">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/75 via-slate-50/40 to-slate-200/30" />
            <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(circle_at_30%_20%,rgba(56,189,248,.18),transparent_55%),radial-gradient(circle_at_70%_80%,rgba(244,63,94,.14),transparent_55%)]" />
            <div className="pointer-events-none absolute -left-1/3 top-0 h-full w-2/3 rotate-12 bg-white/30 blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-white/50 shadow-[inset_0_1px_0_rgba(255,255,255,.25)]" />

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={safeImg(p.image)}
              alt={p.name}
              className="relative h-full w-full object-contain p-4
                         drop-shadow-[0_18px_35px_rgba(0,0,0,0.20)]
                         transition duration-300 group-hover:scale-[1.05]"
              loading="lazy"
            />
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs text-slate-600">
              <span className="font-mono">{p.id}</span>
            </div>
            <div className="text-lg font-black text-slate-900">${money(p.price)}</div>
          </div>

          <Stars value={p.rating} />

          <p className="line-clamp-2 text-sm text-slate-700">
            {p.description || "Sin descripción."}
          </p>

          <div className="pt-2">
            <div className="h-10 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white grid place-items-center text-sm font-semibold transition group-hover:brightness-110">
              Ver detalle →
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-3xl border border-white/40 bg-white/35 p-4 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2 min-w-0">
          <div className="h-4 w-40 rounded bg-slate-200/70" />
          <div className="h-3 w-24 rounded bg-slate-200/60" />
        </div>
        <div className="h-6 w-24 rounded-full bg-slate-200/60" />
      </div>
      <div className="mt-4 h-44 rounded-2xl bg-slate-200/50" />
      <div className="mt-4 space-y-2">
        <div className="h-4 w-28 rounded bg-slate-200/70" />
        <div className="h-3 w-24 rounded bg-slate-200/60" />
        <div className="h-3 w-full rounded bg-slate-200/50" />
        <div className="h-3 w-4/5 rounded bg-slate-200/50" />
        <div className="mt-2 h-10 rounded-2xl bg-slate-200/60" />
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
