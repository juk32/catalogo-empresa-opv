"use client"

import { useEffect, useMemo, useRef, useState } from "react"
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

function cn(...s: Array<string | false | null | undefined>) {
  return s.filter(Boolean).join(" ")
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
   Product Card (fijo)
========================= */
function ProductCard({ p, i }: { p: Product; i: number }) {
  const stock = Number(p.stock ?? 0)
  const inStock = stock > 0

  const rating = Number(p.rating ?? 0)
  const discountPct = Math.max(10, Math.min(35, Math.round(18 + (5 - Math.min(5, Math.max(0, rating))) * 4)))
  const oldPrice = Math.round((p.price / (1 - discountPct / 100)) * 100) / 100
  const reviews = Math.max(8, Math.min(1400, Math.round(60 + rating * 220 + (i % 9) * 37)))

  return (
    <Link
      href={`/producto/${encodeURIComponent(p.id)}`}
      className={cn(
        "group relative block h-full overflow-hidden rounded-2xl",
        "bg-white/80 backdrop-blur border border-white/60 ring-1 ring-slate-200/70",
        "shadow-[0_18px_60px_-40px_rgba(15,23,42,.45)]",
        "transition active:scale-[0.99] md:hover:-translate-y-[2px] md:hover:shadow-[0_26px_90px_-55px_rgba(15,23,42,.55)]"
      )}
      style={{ animationDelay: `${Math.min(i * 25, 220)}ms` }}
      draggable={false}
    >
      {/* Fondo efecto */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            background:
              "linear-gradient(135deg, rgba(56,189,248,.9), rgba(99,102,241,.8), rgba(244,63,94,.75))",
          }}
        />
        <div className="absolute inset-0 opacity-[0.08] mix-blend-multiply [background-size:18px_18px] [background-image:linear-gradient(135deg,rgba(15,23,42,.2)_25%,transparent_25%,transparent_50%,rgba(15,23,42,.2)_50%,rgba(15,23,42,.2)_75%,transparent_75%,transparent)]" />
      </div>

      {/* brillo hover desktop */}
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        <div className="absolute -left-1/2 top-0 h-full w-[60%] rotate-12 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="h-full w-full blur-[2px] [background:linear-gradient(90deg,transparent,rgba(255,255,255,.55),transparent)]" />
        </div>
      </div>

      <div className="relative flex h-full flex-col">
        <div className="relative h-[170px]">
          <div className="absolute inset-0 bg-white/55" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={safeImg(p.image)}
            alt={p.name}
            className="relative h-full w-full object-contain p-5 transition-transform duration-300 md:group-hover:scale-[1.05]"
            loading="lazy"
            draggable={false}
          />

          <div className="absolute left-3 top-3">
            <span className="rounded-full bg-rose-600 px-2.5 py-1 text-[11px] font-extrabold text-white shadow-sm">
              -{discountPct}%
            </span>
          </div>

          <div className="absolute right-3 top-3">
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm border",
                inStock
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-slate-100 text-slate-700 border-slate-200"
              )}
            >
              {inStock ? `En stock (${stock})` : "Agotado"}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold text-sky-700">{p.category || "Sin categoría"}</span>
            <span className="text-[11px] text-slate-500 font-mono">{p.id}</span>
          </div>

          <h3 className="mt-2 line-clamp-2 text-[15px] font-semibold text-slate-900 md:group-hover:text-sky-700">
            {p.name}
          </h3>

          <div className="mt-2 flex items-center gap-2">
            <Stars value={p.rating} />
            <span className="text-xs text-slate-500">({reviews.toLocaleString("es-MX")})</span>
          </div>

          <div className="mt-3 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] text-slate-500">Precio</p>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-extrabold tracking-tight text-slate-900">${money(p.price)}</div>
                <div className="text-xs text-slate-400 line-through">${money(oldPrice)}</div>
              </div>
              <p className="mt-1 text-xs text-slate-600">{inStock ? "Entrega rápida disponible" : "Sin disponibilidad"}</p>
            </div>

            <div className="shrink-0">
              <div
                className="rounded-full px-4 py-2 text-xs font-extrabold text-white shadow-sm transition md:group-hover:brightness-95"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(56,189,248,.95), rgba(99,102,241,.9), rgba(244,63,94,.85))",
                }}
              >
                Ver →
              </div>
            </div>
          </div>

          <div className="mt-auto pt-3">
            <p className="line-clamp-2 text-sm text-slate-600">{p.description || "Sin descripción."}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}

function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="h-[170px] bg-slate-100" />
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

/* =========================
   Carrusel por familia
========================= */
function CategoryCarouselSection({
  title,
  items,
  startIndex = 0,
}: {
  title: string
  items: Product[]
  startIndex?: number
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)

  const updateEdges = () => {
    const el = scrollerRef.current
    if (!el) return
    const tol = 2
    setCanLeft(el.scrollLeft > tol)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - tol)
  }

  const scrollByAmount = (dir: "left" | "right") => {
    const el = scrollerRef.current
    if (!el) return
    const amount = Math.round(el.clientWidth * 0.92)
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" })
  }

  useEffect(() => {
    updateEdges()
    const el = scrollerRef.current
    if (!el) return
    const onScroll = () => updateEdges()
    el.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", updateEdges)
    return () => {
      el.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", updateEdges)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items?.length])

  if (!items?.length) return null

  return (
    <section className="relative">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] font-extrabold text-slate-500">Familia</div>
          <h2 className="truncate text-xl font-extrabold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-600">
            {items.length} producto{items.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollByAmount("left")}
            disabled={!canLeft}
            className={cn(
              "grid h-10 w-10 place-items-center rounded-full backdrop-blur ring-1 shadow-sm transition",
              canLeft
                ? "bg-white/80 ring-slate-200 hover:bg-white"
                : "bg-white/50 ring-slate-100 text-slate-300 cursor-not-allowed"
            )}
            aria-label="Anterior"
          >
            ←
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/70 backdrop-blur ring-1 ring-slate-200 shadow-[0_30px_120px_-80px_rgba(15,23,42,.6)]">
        <div className="pointer-events-none absolute -top-16 left-12 h-72 w-72 rounded-full bg-sky-200/35 blur-[95px]" />
        <div className="pointer-events-none absolute -bottom-16 right-12 h-72 w-72 rounded-full bg-rose-200/35 blur-[105px]" />

        {/* Fade RIGHT */}
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 right-0 z-10 w-28 transition-opacity",
            canRight ? "opacity-100" : "opacity-0"
          )}
          style={{
            background:
              "linear-gradient(to left, rgba(255,255,255,1) 0%, rgba(255,255,255,.92) 35%, rgba(255,255,255,0) 100%)",
          }}
        />

        <button
          type="button"
          onClick={() => scrollByAmount("right")}
          disabled={!canRight}
          className={cn(
            "absolute right-5 top-1/2 z-20 -translate-y-1/2",
            "grid h-11 w-11 place-items-center rounded-full",
            "bg-white/90 backdrop-blur ring-1 ring-slate-200 shadow-[0_10px_30px_-18px_rgba(15,23,42,.6)]",
            "transition hover:bg-white active:scale-[0.98]",
            !canRight ? "opacity-40 cursor-not-allowed" : "opacity-100"
          )}
          aria-label="Siguiente"
        >
          ›
        </button>

        {/* Fade LEFT */}
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 z-10 w-20 transition-opacity",
            canLeft ? "opacity-100" : "opacity-0"
          )}
          style={{
            background:
              "linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,.9) 35%, rgba(255,255,255,0) 100%)",
          }}
        />

        <div
          ref={scrollerRef}
          className={cn(
            "relative overflow-x-auto px-4 py-4 scroll-smooth",
            "touch-pan-x overscroll-x-contain [-webkit-overflow-scrolling:touch]",
            "[scrollbar-width:none] [-ms-overflow-style:none]",
            "[&::-webkit-scrollbar]:hidden"
          )}
        >
          <div className="flex gap-4 snap-x snap-mandatory pr-16">
            {items.map((p, idx) => (
              <div
                key={p.id}
                className={cn(
                  "snap-start",
                  "min-w-[240px] sm:min-w-[300px] lg:min-w-[340px]",
                  "h-[510px] sm:h-[520px]"
                )}
              >
                <ProductCard p={p} i={startIndex + idx} />
              </div>
            ))}
          </div>
        </div>

        <div className="md:hidden px-5 pb-4 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-400">Desliza →</div>
          <div className="text-xs font-extrabold bg-gradient-to-r from-sky-600 via-indigo-600 to-rose-600 bg-clip-text text-transparent">
            Ver más
          </div>
        </div>
      </div>
    </section>
  )
}

/* =========================
   Grid por familia
========================= */
function CategoryGridSection({
  title,
  items,
  startIndex = 0,
}: {
  title: string
  items: Product[]
  startIndex?: number
}) {
  if (!items?.length) return null

  return (
    <section className="relative">
      <div className="mb-3">
        <div className="text-[11px] font-extrabold text-slate-500">Familia</div>
        <h2 className="text-xl font-extrabold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-600">
          {items.length} producto{items.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((p, idx) => (
          <div key={p.id} className="h-[520px]">
            <ProductCard p={p} i={startIndex + idx} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default function ProductosPage() {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])

  const [q, setQ] = useState("")
  const [qDebounced, setQDebounced] = useState("")
  const [category, setCategory] = useState("Todas")

  const [sort, setSort] = useState<"relevance" | "price_asc" | "price_desc" | "rating_desc" | "stock_desc">(
    "relevance"
  )

  const [view, setView] = useState<"carousel" | "grid">("carousel")

  const [reloading, setReloading] = useState(false)

  // ✅ Calcula el offset real del header para sticky (evita que “baje”)
  useEffect(() => {
    const setOffset = () => {
      const header = document.querySelector("header")
      const h = header ? Math.round(header.getBoundingClientRect().height) : 72
      document.documentElement.style.setProperty("--header-offset", `${h}px`)
    }
    setOffset()
    window.addEventListener("resize", setOffset)
    return () => window.removeEventListener("resize", setOffset)
  }, [])

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

  const grouped = useMemo(() => {
    const map = new Map<string, Product[]>()
    for (const p of filtered) {
      const key = (p.category || "Sin categoría").trim() || "Sin categoría"
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(p)
    }
    const keys = Array.from(map.keys()).sort((a, b) => a.localeCompare(b, "es"))
    return keys.map((k) => ({ category: k, items: map.get(k)! }))
  }, [filtered])

  return (
    <section className="relative w-full min-w-0 space-y-5">
      {/* Fondo */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute -top-40 left-1/2 h-[520px] w-[980px] -translate-x-1/2 rounded-full bg-sky-200/35 blur-[140px]" />
        <div className="absolute top-24 right-[-220px] h-[520px] w-[520px] rounded-full bg-rose-200/25 blur-[150px]" />
        <div className="absolute bottom-[-260px] left-[-220px] h-[640px] w-[640px] rounded-full bg-indigo-200/20 blur-[170px]" />
      </div>

      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Catálogo</h1>
          <p className="mt-1 text-slate-600">Busca por nombre, categoría o ID.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="text-sm text-slate-600">
            {loading ? "Cargando…" : `${filtered.length} producto${filtered.length === 1 ? "" : "s"}`}
          </div>

          <div className="flex items-center rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setView("carousel")}
              className={cn(
                "rounded-xl px-3 py-2 text-xs font-extrabold transition",
                view === "carousel" ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-50"
              )}
            >
              Carrusel
            </button>
            <button
              type="button"
              onClick={() => setView("grid")}
              className={cn(
                "rounded-xl px-3 py-2 text-xs font-extrabold transition",
                view === "grid" ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-50"
              )}
            >
              Cuadrícula
            </button>
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

      {/* Filtros */}
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

          <div className="hidden md:block text-sm text-slate-500 text-right">Tip: usa el buscador para ID exacto o nombre.</div>
        </div>

        {categories.length > 2 ? (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {categories.slice(0, 14).map((c) => {
              const active = c === category
              return (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cn(
                    "whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold transition",
                    active
                      ? "bg-slate-900 text-white border-slate-900"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  )}
                >
                  {c}
                </button>
              )
            })}
          </div>
        ) : null}
      </div>

      {/* Buscador sticky (NO baja) */}
      <div className="sticky z-40" style={{ top: "var(--header-offset, 72px)" }}>
        <div className="pt-2">
          <div className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur p-3 shadow-sm">
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
      </div>

      {/* Listado */}
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
        <div className="space-y-10">
          {grouped.map((g, sectionIdx) =>
            view === "carousel" ? (
              <CategoryCarouselSection
                key={g.category}
                title={g.category}
                items={g.items}
                startIndex={sectionIdx * 1000}
              />
            ) : (
              <CategoryGridSection
                key={g.category}
                title={g.category}
                items={g.items}
                startIndex={sectionIdx * 1000}
              />
            )
          )}
        </div>
      )}

      <style>{`
        @keyframes spinAnim { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spinAnim 650ms linear; }
      `}</style>
    </section>
  )
}