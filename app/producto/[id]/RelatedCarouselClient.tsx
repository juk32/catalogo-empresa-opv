"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"

type RelatedItem = {
  id: string
  name: string
  price: number
  image: string | null
  category: string | null
  rating: number | null
  stock: number | null
}

function cn(...s: Array<string | false | null | undefined>) {
  return s.filter(Boolean).join(" ")
}

function safeImg(src?: string | null) {
  if (!src) return "/placeholder.png"
  if (src.startsWith("/") || src.startsWith("http")) return src
  return "/placeholder.png"
}

function money(n: number) {
  return (Number(n) || 0).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function clampStars(n: number) {
  const v = Math.round(Number(n) || 0)
  return Math.max(0, Math.min(5, v))
}

function Stars({ value }: { value: number }) {
  const s = clampStars(value)
  return (
    <div className="flex items-center gap-2">
      <div className="text-amber-500 text-xs leading-none">
        {"★".repeat(s)}
        <span className="text-slate-300">{s < 5 ? "★".repeat(5 - s) : ""}</span>
      </div>
      <div className="text-[11px] text-slate-600">{Number(value || 0).toFixed(1)}</div>
    </div>
  )
}

/* =========================
   Card COMPACTA (mejor acomodada)
   - Altura fija más baja
   - Imagen centrada
   - Precio y rating no se cortan
========================= */
function RelatedCard({ p }: { p: RelatedItem }) {
  const stock = Number(p.stock ?? 0)
  const inStock = stock > 0

  return (
    <Link
      href={`/producto/${encodeURIComponent(p.id)}`}
      className={cn(
        "group relative block h-full overflow-hidden rounded-2xl",
        "bg-white/75 backdrop-blur border border-white/60 ring-1 ring-slate-200/70",
        "shadow-[0_18px_60px_-40px_rgba(15,23,42,.45)]",
        "transition active:scale-[0.99] md:hover:-translate-y-[2px] md:hover:shadow-[0_26px_90px_-55px_rgba(15,23,42,.55)]"
      )}
      draggable={false}
    >
      {/* mini glow */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.10] [background:linear-gradient(135deg,rgba(56,189,248,.95),rgba(99,102,241,.92),rgba(244,63,94,.88))]" />

      <div className="relative p-4">
        {/* top row */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold text-sky-700">{p.category || "Sin categoría"}</span>
          <span
            className={cn(
              "rounded-full border px-2.5 py-1 text-[11px] font-semibold",
              inStock
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-slate-100 text-slate-700 border-slate-200"
            )}
          >
            {inStock ? `Stock ${stock}` : "Agotado"}
          </span>
        </div>

        {/* image frame (más limpio) */}
        <div className="mt-3 rounded-2xl border border-white/70 bg-white/65 p-3">
          <div className="relative h-[130px] sm:h-[140px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={safeImg(p.image)}
              alt={p.name}
              className="h-full w-full object-contain transition-transform duration-300 md:group-hover:scale-[1.05]"
              loading="lazy"
              draggable={false}
            />
          </div>
        </div>

        {/* body */}
        <div className="mt-3">
          <div className="line-clamp-2 text-sm font-extrabold text-slate-900 md:group-hover:text-sky-700">
            {p.name}
          </div>

          <div className="mt-2 flex items-center justify-between gap-3">
            <Stars value={p.rating ?? 0} />
            <div className="text-lg font-black text-slate-900">${money(p.price)}</div>
          </div>
        </div>
      </div>
    </Link>
  )
}

/* =========================
   Carrusel suave (menos tieso)
   - snap + scroll-smooth
   - flechas NO tapan cards (van fuera)
   - fade alineado
========================= */
export default function RelatedCarouselClient({
  title,
  items,
}: {
  title: string
  items: RelatedItem[]
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)

  const hasItems = items?.length > 0

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
    const amount = Math.round(el.clientWidth * 0.88) // menos agresivo, más “natural”
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
  }, [items.length])

  // 👇 opcional: ordena para que primero salgan los que tienen stock
  const sorted = useMemo(() => {
    return [...items].sort((a, b) => Number(b.stock ?? 0) - Number(a.stock ?? 0))
  }, [items])

  if (!hasItems) return null

  return (
    <section className="relative">
      {/* Header + flechas (ya NO flotan encima del carrusel) */}
      <div className="mb-3 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] font-extrabold text-slate-600">Recomendados</div>
          <h3 className="truncate text-lg font-extrabold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-700">{items.length} producto(s)</p>
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

          <button
            type="button"
            onClick={() => scrollByAmount("right")}
            disabled={!canRight}
            className={cn(
              "grid h-10 w-10 place-items-center rounded-full backdrop-blur ring-1 shadow-sm transition",
              canRight
                ? "bg-white/80 ring-slate-200 hover:bg-white"
                : "bg-white/50 ring-slate-100 text-slate-300 cursor-not-allowed"
            )}
            aria-label="Siguiente"
          >
            →
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-white/55 bg-white/55 shadow-[0_30px_90px_-65px_rgba(15,23,42,.55)] backdrop-blur-xl">
        {/* glow suave */}
        <div className="pointer-events-none absolute -top-16 left-10 h-72 w-72 rounded-full bg-sky-200/35 blur-[95px]" />
        <div className="pointer-events-none absolute -bottom-20 right-10 h-72 w-72 rounded-full bg-rose-200/25 blur-[110px]" />

        {/* Fade right */}
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 right-0 z-10 w-20 sm:w-28 transition-opacity",
            canRight ? "opacity-100" : "opacity-0"
          )}
          style={{
            background:
              "linear-gradient(to left, rgba(255,255,255,1) 0%, rgba(255,255,255,.90) 38%, rgba(255,255,255,0) 100%)",
          }}
        />

        {/* Fade left */}
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 z-10 w-14 sm:w-20 transition-opacity",
            canLeft ? "opacity-100" : "opacity-0"
          )}
          style={{
            background:
              "linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,.88) 38%, rgba(255,255,255,0) 100%)",
          }}
        />

        {/* scroller */}
        <div
          ref={scrollerRef}
          className={cn(
            "relative overflow-x-auto scroll-smooth",
            "touch-pan-x overscroll-x-contain [-webkit-overflow-scrolling:touch]",
            "[scrollbar-width:none] [-ms-overflow-style:none]",
            "[&::-webkit-scrollbar]:hidden",
            "px-4 py-4"
          )}
        >
          <div className="flex gap-4 snap-x snap-mandatory pr-10">
            {sorted.map((p) => (
              <div
                key={p.id}
                className={cn(
                  "snap-start",
                  // ✅ tarjetas MISMO tamaño y más compactas
                  "min-w-[220px] sm:min-w-[260px] lg:min-w-[300px]",
                  "h-[290px] sm:h-[310px]"
                )}
              >
                <RelatedCard p={p} />
              </div>
            ))}
          </div>
        </div>

        {/* hint móvil/tablet */}
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