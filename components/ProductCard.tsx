"use client"

import Link from "next/link"

export type Product = {
  id: string
  name: string
  price: number
  category: string
  image?: string
  description: string
  details?: any
  rating: number
  stock: number

  // Opcionales por si quieres usarlos:
  oldPrice?: number
  discountPct?: number
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
      <span className="text-xs text-slate-500">{(value ?? 0).toFixed(1)}</span>
    </div>
  )
}

export default function ProductCard({ p }: { p: Product }) {
  const inStock = (p.stock ?? 0) > 0
  const discount =
    typeof p.discountPct === "number"
      ? p.discountPct
      : typeof p.oldPrice === "number" && p.oldPrice > p.price
      ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
      : null

  return (
    <div
      className={[
        "group relative overflow-hidden rounded-[28px] border border-slate-200",
        "bg-white/70 backdrop-blur-2xl",
        "shadow-[0_20px_70px_-50px_rgba(2,6,23,0.35)]",
        "transition hover:-translate-y-1 hover:shadow-[0_40px_90px_-70px_rgba(2,6,23,0.55)]",
      ].join(" ")}
    >
      {/* Shine hover */}
      <div className="pointer-events-none absolute -inset-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute left-1/2 top-0 h-[260%] w-32 -translate-x-1/2 rotate-12 bg-white/40 blur-2xl" />
      </div>

      {/* Header image */}
      <div className="relative">
        <div className="aspect-[4/3] w-full overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100">
          <img
            src={safeImg(p.image)}
            alt={p.name}
            className="h-full w-full object-contain p-4 transition-transform duration-200 group-hover:scale-[1.04]"
            loading="lazy"
          />
        </div>

        {/* Discount badge */}
        {discount !== null && discount > 0 && (
          <div className="absolute left-3 top-3">
            <span className="rounded-full bg-rose-500 px-2.5 py-1 text-[11px] font-extrabold text-white shadow">
              -{discount}%
            </span>
          </div>
        )}

        {/* Stock chip */}
        <div className="absolute left-3 bottom-3">
          <span
            className={[
              "rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm",
              inStock
                ? "bg-emerald-500/15 text-emerald-800 border border-emerald-300/40"
                : "bg-rose-500/15 text-rose-800 border border-rose-300/40",
            ].join(" ")}
          >
            {inStock ? `En stock (${p.stock})` : "Sin stock"}
          </span>
        </div>

        {/* Fav / icon placeholder */}
        <button
          type="button"
          className="absolute right-3 top-3 h-9 w-9 rounded-full border border-slate-200 bg-white/80 backdrop-blur shadow-sm hover:bg-white transition"
          aria-label="Favorito"
          title="Favorito"
        >
          ♡
        </button>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-sky-700 flex items-center gap-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-sky-500/10 border border-sky-300/40">
                ⚡
              </span>
              {p.category}
            </p>

            <h3 className="mt-2 line-clamp-2 text-base font-extrabold text-slate-900">
              {p.name}
            </h3>

            <p className="mt-1 text-xs text-slate-500">ID: {p.id}</p>
          </div>
        </div>

        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-slate-500">Precio</p>
            <div className="flex items-baseline gap-2">
              <p className="text-xl font-extrabold text-sky-700">${money(p.price)}</p>
              {typeof p.oldPrice === "number" && p.oldPrice > p.price && (
                <p className="text-xs text-slate-400 line-through">${money(p.oldPrice)}</p>
              )}
            </div>
          </div>

          <Link
            href={`/producto/${encodeURIComponent(p.id)}`}
            className="rounded-full bg-sky-600 text-white px-4 py-2 text-xs font-bold shadow hover:bg-sky-700 transition"
          >
            Ver ahora
          </Link>
        </div>

        <div className="mt-3">
          <Stars value={p.rating ?? 0} />
        </div>

        <p className="mt-3 line-clamp-2 text-sm text-slate-600">
          {p.description}
        </p>
      </div>
    </div>
  )
}
