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

function ProductCard({ p }: { p: Product }) {
  const inStock = (p.stock ?? 0) > 0

  return (
    <Link
      href={`/producto/${encodeURIComponent(p.id)}`}
      className="group relative overflow-hidden rounded-[28px] border border-white/25 bg-white/10 backdrop-blur-xl
                 shadow-[0_18px_60px_-35px_rgba(0,0,0,0.55)]
                 transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_90px_-45px_rgba(0,0,0,0.7)]"
    >
      {/* brillo superior */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/25 to-transparent" />

      {/* glow hover */}
      <div className="pointer-events-none absolute -inset-20 opacity-0 blur-3xl transition duration-500 group-hover:opacity-100
                      bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.35),transparent_55%),radial-gradient(circle_at_70%_60%,rgba(244,63,94,0.28),transparent_60%)]" />

      <div className="relative p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[11px] text-white/70">ID</div>
            <div className="mt-0.5 font-mono text-xs text-white/85 truncate">{p.id}</div>
          </div>

          <span
            className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur ${
              inStock
                ? "border-emerald-200/40 bg-emerald-500/15 text-emerald-200"
                : "border-white/25 bg-white/10 text-white/70"
            }`}
          >
            {inStock ? "En stock" : "Agotado"}
          </span>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur">
          <div className="p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.image || "/placeholder.png"}
              alt={p.name}
              className="h-40 w-full object-contain transition duration-300 group-hover:scale-[1.02]"
              loading="lazy"
            />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="min-w-0 font-bold leading-tight text-white">
              <span className="block truncate">{p.name}</span>
            </h3>
            <div className="shrink-0 font-black text-white">${money(p.price)}</div>
          </div>

          <div className="mt-1 flex items-center justify-between text-xs">
            <span className="text-white/70">{p.category}</span>
            <span className="text-white/55">{p.rating?.toFixed?.(1) ?? "—"} ★</span>
          </div>

          <p className="mt-2 text-sm text-white/75 line-clamp-2">
            {p.description || "Sin descripción."}
          </p>

          <div className="mt-4">
            <div
              className="h-11 rounded-2xl border border-white/20 bg-white/10 backdrop-blur
                         grid place-items-center text-sm font-semibold text-white
                         transition duration-300 group-hover:bg-white/15"
            >
              Ver detalle
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function ProductosPage() {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])

  const [q, setQ] = useState("")
  const [qDebounced, setQDebounced] = useState("")
  const [category, setCategory] = useState("Todas")

  async function load() {
    setLoading(true)
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
    }
  }

  useEffect(() => {
    load()
  }, [])

  // Debounce para móvil
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
    <section className="relative space-y-6">
      {/* Fondo con “blobs” suaves */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl opacity-60
                        bg-[radial-gradient(circle_at_30%_30%,rgba(56,189,248,0.55),transparent_60%)]" />
        <div className="absolute top-32 -left-16 h-72 w-72 rounded-full blur-3xl opacity-50
                        bg-[radial-gradient(circle_at_30%_30%,rgba(244,63,94,0.45),transparent_60%)]" />
        <div className="absolute -bottom-24 right-0 h-80 w-80 rounded-full blur-3xl opacity-50
                        bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.45),transparent_60%)]" />
      </div>

      {/* Header */}
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Productos</h1>
          <p className="mt-1 text-slate-700/80">Catálogo general</p>
        </div>

        <div className="text-xs text-slate-600">
          {loading ? "Cargando…" : `${filtered.length} producto${filtered.length === 1 ? "" : "s"}`}
        </div>
      </div>

      {/* Controles glass */}
      <div className="rounded-[28px] border border-white/30 bg-white/15 backdrop-blur-xl p-4
                      shadow-[0_18px_70px_-45px_rgba(0,0,0,0.6)]">
        <div className="grid gap-3 md:grid-cols-[1fr,240px,160px]">
          {/* Search glass */}
          <div className="flex items-center gap-3 rounded-2xl border border-white/25 bg-white/10 px-4 py-3 backdrop-blur">
            <span className="text-white/70 text-xl">🔎</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nombre, categoría o ID…"
              className="w-full bg-transparent outline-none text-sm text-slate-900 placeholder:text-slate-700/60"
            />
            {q ? (
              <button
                className="rounded-xl border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold text-slate-900 hover:bg-white/15"
                onClick={() => setQ("")}
              >
                Limpiar
              </button>
            ) : null}
          </div>

          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-2xl border border-white/25 bg-white/10 px-4 py-3 text-sm text-slate-900 backdrop-blur"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Reload */}
          <button
            onClick={load}
            className="rounded-2xl border border-white/25 bg-white/10 px-4 py-3 text-sm font-semibold text-slate-900
                       backdrop-blur hover:bg-white/15 transition"
          >
            Recargar
          </button>
        </div>

        {/* Chips glass */}
        {categories.length > 2 ? (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {categories.slice(0, 10).map((c) => {
              const active = c === category
              return (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold transition backdrop-blur
                    ${
                      active
                        ? "border-slate-900/10 bg-slate-900 text-white"
                        : "border-white/25 bg-white/10 text-slate-900 hover:bg-white/15"
                    }`}
                >
                  {c}
                </button>
              )
            })}
          </div>
        ) : null}
      </div>

      {/* Lista */}
      {loading ? (
        <div className="rounded-[28px] border border-white/30 bg-white/15 backdrop-blur-xl p-6">
          Cargando productos…
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-[28px] border border-white/30 bg-white/15 backdrop-blur-xl p-6 text-slate-700">
          No hay productos con esos filtros.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in zoom-in duration-200">
          {filtered.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </section>
  )
}
