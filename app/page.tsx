"use client"

import Link from "next/link"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"

/* ======================= */
function money(n: number) {
  return (Number(n) || 0).toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/* ======================= */
/* HERO SLIDER FULL WIDTH */
/* ======================= */

type HeroSlide = {
  id: string
  title: string
  subtitle: string
  ctaText: string
  ctaHref: string
  image: string
  badge?: string
}

function PrimeHeroSlider({
  slides,
  autoPlay = true,
  intervalMs = 6500,
}: {
  slides: HeroSlide[]
  autoPlay?: boolean
  intervalMs?: number
}) {
  const [index, setIndex] = useState(0)
  const count = slides.length

  const prev = () => setIndex((i) => (i - 1 + count) % count)
  const next = () => setIndex((i) => (i + 1) % count)

  useEffect(() => {
    if (!autoPlay || count <= 1) return
    const t = window.setInterval(() => setIndex((i) => (i + 1) % count), intervalMs)
    return () => window.clearInterval(t)
  }, [autoPlay, count, intervalMs])

  const startX = useRef<number | null>(null)
  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0]?.clientX ?? null
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return
    const endX = e.changedTouches[0]?.clientX ?? startX.current
    const dx = endX - startX.current
    startX.current = null
    if (Math.abs(dx) < 40) return
    if (dx > 0) prev()
    else next()
  }

  return (
    <section className="w-full pt-6">
      <div className="relative">
        <div className="pointer-events-none absolute -inset-8 -z-10 bg-gradient-to-r from-sky-200/30 via-blue-200/20 to-cyan-200/25 blur-3xl" />

        <div
          className="relative overflow-hidden rounded-[32px] bg-white/60 backdrop-blur ring-1 ring-slate-200 
                     shadow-[0_60px_160px_-90px_rgba(15,23,42,.65)] mx-3 sm:mx-6 lg:mx-10"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <motion.div
            className="flex"
            animate={{ x: `-${index * 100}%` }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            style={{ width: `${count * 100}%` }}
          >
            {slides.map((s) => (
              <div
                key={s.id}
                className="relative w-full shrink-0 h-[320px] sm:h-[460px] lg:h-[560px] xl:h-[620px]"
              >
                <img
                  src={s.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/65 to-white/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-transparent" />

                <div className="relative z-10 flex h-full items-center">
                  <div className="w-full max-w-2xl px-8 sm:px-14 lg:px-20">
                    {s.badge && (
                      <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-4 py-2 text-xs font-extrabold text-slate-700 shadow-sm">
                        <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-extrabold text-sky-700">
                          Neon
                        </span>
                        {s.badge}
                      </div>
                    )}

                    <h2 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
                      {s.title}
                    </h2>

                    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600">
                      {s.subtitle}
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-4">
                      <Link
                        href={s.ctaHref}
                        className="rounded-2xl px-7 py-3 text-base font-extrabold text-white"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(56,189,248,.95), rgba(37,99,235,.92))",
                        }}
                      >
                        {s.ctaText} →
                      </Link>

                      <Link
                        href="/contacto"
                        className="rounded-2xl border border-white/60 bg-white/60 px-7 py-3 text-base font-extrabold text-slate-800 backdrop-blur transition hover:bg-white/80"
                      >
                        Contacto
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          <button
            onClick={prev}
            className="absolute left-5 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-3 shadow-md hover:bg-white"
          >
            ‹
          </button>

          <button
            onClick={next}
            className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-3 shadow-md hover:bg-white"
          >
            ›
          </button>

          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
            {slides.map((_, di) => (
              <button key={di} onClick={() => setIndex(di)}>
                <span
                  className={`block h-2.5 rounded-full transition-all ${
                    di === index
                      ? "w-8 bg-sky-600"
                      : "w-2.5 bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ======================= */
/* PAGE */
/* ======================= */

export default function HomePage() {
  const heroSlides = useMemo<HeroSlide[]>(
    () => [
      {
        id: "h1",
        badge: "Opera • Catálogo",
        title: "Explora tu catálogo en segundos",
        subtitle: "Interfaz clara y moderna para consultar y generar pedidos rápido.",
        ctaText: "Ver catálogo",
        ctaHref: "/productos",
        image:
          "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=2400&q=70",
      },
      {
        id: "h2",
        badge: "Pedidos • Rápido",
        title: "Genera pedidos sin fricción",
        subtitle: "Agrega productos y arma tu pedido en un flujo súper simple.",
        ctaText: "Ir a pedido",
        ctaHref: "/pedido",
        image:
          "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=2400&q=70",
      },
    ],
    []
  )

  return (
    <div className="relative">
      {/* HERO */}
      <PrimeHeroSlider slides={heroSlides} />

      {/* LO DEMÁS SE MANTIENE IGUAL ABAJO */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-16">
        <h2 className="text-center text-2xl font-extrabold text-slate-900">
          Most Popular Items
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-slate-200"
            >
              <div className="h-44 bg-slate-200" />
              <div className="p-5">
                <div className="text-base font-extrabold text-slate-900">
                  Producto {i}
                </div>
                <div className="mt-2 text-sm text-slate-500">$99.00</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
