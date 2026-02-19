"use client"

import Link from "next/link"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"

/* =======================
   Helpers
======================= */
function money(n: number) {
  return (Number(n) || 0).toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

type Item = {
  name: string
  sub: string
  price: number
  image: string
}

type PanelSlide = {
  badgeRight: string
  titleLeft: string
  items: Item[]
}

/* =======================
   PRIME-LIKE HERO SLIDER (Neon Clear)
======================= */
type HeroSlide = {
  id: string
  title: string
  subtitle: string
  ctaText: string
  ctaHref: string
  image: string
  badge?: string
}

/* =======================
   FullBleed: rompe el max-width del layout
   (si tu RootLayout tiene main max-w-6xl)
======================= */
function FullBleed({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative left-1/2 right-1/2 w-screen -ml-[50vw] -mr-[50vw]">
      {children}
    </div>
  )
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

  // swipe mobile
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
    <section className="w-screen pt-3 sm:pt-5">
      <div className="relative">
        {/* Glow exterior */}
        <div className="pointer-events-none absolute -inset-10 -z-10 rounded-[44px] bg-gradient-to-r from-sky-200/30 via-blue-200/18 to-cyan-200/25 blur-3xl" />

        {/* Contenedor real (margen bonito en móvil/desktop) */}
        <div
          className="relative overflow-hidden rounded-[26px] sm:rounded-[34px]
                     bg-white/55 backdrop-blur ring-1 ring-slate-200
                     shadow-[0_60px_160px_-105px_rgba(15,23,42,.70)]
                     mx-3 sm:mx-6 lg:mx-10"
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
                className="
                  relative w-full shrink-0
                  h-[320px]
                  sm:h-[460px]
                  lg:h-[560px]
                  xl:h-[640px]
                "
              >
                {/* Imagen */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.image} alt="" className="absolute inset-0 h-full w-full object-cover" />

                {/* Overlay: más fuerte en móvil */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/92 via-white/72 to-white/25 sm:from-white/88 sm:via-white/60 sm:to-white/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent sm:from-white/70" />

                {/* Neon blobs */}
                <div className="pointer-events-none absolute -left-24 -top-20 h-72 w-72 rounded-full bg-sky-300/22 blur-3xl" />
                <div className="pointer-events-none absolute left-1/3 -top-24 h-72 w-72 rounded-full bg-indigo-300/16 blur-3xl" />
                <div className="pointer-events-none absolute right-0 -top-20 h-72 w-72 rounded-full bg-cyan-300/16 blur-3xl" />

                {/* Content */}
                <div className="relative z-10 flex h-full items-center">
                  <div className="w-full px-5 sm:px-12 lg:px-16">
                    <div className="max-w-[38rem]">
                      {s.badge ? (
                        <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/85 px-3 py-1.5 text-[11px] sm:text-xs font-extrabold text-slate-700 shadow-sm">
                          <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-extrabold text-sky-700">
                            Neon
                          </span>
                          {s.badge}
                        </div>
                      ) : null}

                      <h2 className="mt-4 text-[34px] leading-[1.05] font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                        {s.title}
                      </h2>

                      <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
                        {s.subtitle}
                      </p>

                      {/* Botones: móvil columna / desktop fila */}
                      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                        <Link
                          href={s.ctaHref}
                          className="inline-flex w-full sm:w-auto items-center justify-center rounded-2xl px-6 py-3 text-sm sm:text-base font-extrabold text-white shadow-[0_18px_45px_-25px_rgba(2,132,199,.6)]"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(56,189,248,.95), rgba(37,99,235,.92))",
                          }}
                        >
                          {s.ctaText} <span className="ml-2">→</span>
                        </Link>

                        <Link
                          href="/contacto"
                          className="inline-flex w-full sm:w-auto items-center justify-center rounded-2xl border border-white/60 bg-white/70 px-6 py-3 text-sm sm:text-base font-extrabold text-slate-800 backdrop-blur transition hover:bg-white/85"
                        >
                          Contacto
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Arrows */}
          <button
            type="button"
            onClick={prev}
            aria-label="Anterior"
            className="group absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/75 p-3 sm:p-3.5 ring-1 ring-white/60 backdrop-blur shadow-sm transition hover:bg-white/90"
          >
            <span className="block text-xl font-extrabold text-slate-800 transition group-hover:scale-105">
              ‹
            </span>
          </button>

          <button
            type="button"
            onClick={next}
            aria-label="Siguiente"
            className="group absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/75 p-3 sm:p-3.5 ring-1 ring-white/60 backdrop-blur shadow-sm transition hover:bg-white/90"
          >
            <span className="block text-xl font-extrabold text-slate-800 transition group-hover:scale-105">
              ›
            </span>
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 z-20 flex items-center justify-center gap-2">
            {slides.map((_, di) => {
              const active = di === index
              return (
                <button
                  key={di}
                  type="button"
                  onClick={() => setIndex(di)}
                  aria-label={`Ir al slide ${di + 1}`}
                  className="rounded-full p-1"
                >
                  <span
                    className={[
                      "block h-2.5 rounded-full transition-all",
                      active ? "w-8 bg-sky-600" : "w-2.5 bg-slate-300 hover:bg-slate-400",
                    ].join(" ")}
                  />
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

/* =======================
   Panel derecho ESTÁTICO + Fade SOLO en imagen superior
======================= */
function CatalogPanelCarousel({
  slides,
  autoPlay = true,
  intervalMs = 4200,
}: {
  slides: PanelSlide[]
  autoPlay?: boolean
  intervalMs?: number
}) {
  const s = slides[0]

  const images = useMemo(
    () => [
      "https://images.unsplash.com/photo-1585238342028-4bcb2f56b1f1?auto=format&fit=crop&w=1400&q=70",
      "https://images.unsplash.com/photo-1604908177453-746d7d1b4f0b?auto=format&fit=crop&w=1400&q=70",
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1400&q=70",
    ],
    []
  )

  const [imgIndex, setImgIndex] = useState(0)

  useEffect(() => {
    if (!autoPlay || images.length <= 1) return
    const t = window.setInterval(() => setImgIndex((i) => (i + 1) % images.length), intervalMs)
    return () => window.clearInterval(t)
  }, [autoPlay, intervalMs, images.length])

  if (!s) return null

  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-[28px] bg-white/70 backdrop-blur shadow-[0_40px_120px_-70px_rgba(15,23,42,.5)] ring-1 ring-slate-200">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-sky-50 via-white to-transparent" />

        <div className="relative flex items-center justify-between px-6 pt-6">
          <div className="text-sm font-extrabold text-slate-900">{s.titleLeft}</div>
          <div className="rounded-full bg-white/70 px-3 py-1 text-xs font-extrabold text-slate-600 ring-1 ring-slate-200">
            {s.badgeRight}
          </div>
        </div>

        <div className="relative px-6 pb-5 pt-4">
          <div className="grid gap-5">
            {/* CARD 1: imagen cambia con fade */}
            <div className="rounded-2xl bg-white/80 ring-1 ring-slate-200 shadow-[0_16px_45px_-34px_rgba(15,23,42,.22)]">
              <div className="relative h-32 overflow-hidden rounded-t-2xl bg-slate-50">
                <motion.img
                  key={images[imgIndex]}
                  src={images[imgIndex]}
                  alt=""
                  className="h-full w-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/60 to-transparent" />
              </div>

              <div className="p-4">
                <div className="text-sm font-extrabold text-slate-900">{s.items?.[0]?.name}</div>
                <div className="text-[11px] font-semibold text-slate-400">{s.items?.[0]?.sub}</div>

                <div className="mt-2 text-sm font-extrabold text-slate-900">
                  ${money(s.items?.[0]?.price ?? 0)}
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    className="grid h-10 w-10 place-items-center rounded-full bg-white ring-1 ring-slate-200 shadow-sm transition hover:scale-[1.02]"
                    aria-label="Agregar"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="grid h-10 w-10 place-items-center rounded-full bg-sky-600 text-white shadow-sm transition hover:brightness-95"
                    aria-label="Ver"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>

            {/* CARD 2: estática */}
            <div className="rounded-2xl bg-white/80 ring-1 ring-slate-200 shadow-[0_16px_45px_-34px_rgba(15,23,42,.22)]">
              <div className="relative h-32 overflow-hidden rounded-t-2xl bg-slate-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.items?.[1]?.image} alt="" className="h-full w-full object-cover" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/60 to-transparent" />
              </div>

              <div className="p-4">
                <div className="text-sm font-extrabold text-slate-900">{s.items?.[1]?.name}</div>
                <div className="text-[11px] font-semibold text-slate-400">{s.items?.[1]?.sub}</div>

                <div className="mt-2 text-sm font-extrabold text-slate-900">
                  ${money(s.items?.[1]?.price ?? 0)}
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    className="grid h-10 w-10 place-items-center rounded-full bg-white ring-1 ring-slate-200 shadow-sm transition hover:scale-[1.02]"
                    aria-label="Agregar"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="grid h-10 w-10 place-items-center rounded-full bg-sky-600 text-white shadow-sm transition hover:brightness-95"
                    aria-label="Ver"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dots (3 imágenes) */}
        <div className="pb-6">
          <div className="flex items-center justify-center gap-2">
            {images.map((_, di) => {
              const active = di === imgIndex
              return (
                <button
                  key={di}
                  type="button"
                  onClick={() => setImgIndex(di)}
                  aria-label={`Imagen ${di + 1}`}
                  className="rounded-full p-1"
                >
                  <span
                    className={[
                      "block h-2.5 rounded-full transition-all",
                      active ? "w-7 bg-sky-600" : "w-2.5 bg-slate-300 hover:bg-slate-400",
                    ].join(" ")}
                  />
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[40px] bg-gradient-to-r from-sky-200/35 via-blue-200/20 to-cyan-200/30 blur-2xl" />
    </div>
  )
}

function Info({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="flex items-center gap-4 px-6 py-5">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-200">
        <span className="text-sm font-extrabold">◎</span>
      </div>
      <div>
        <div className="text-sm font-extrabold text-slate-900">{title}</div>
        <div className="text-xs font-semibold text-slate-400">{sub}</div>
      </div>
    </div>
  )
}

/* =======================
   Page
======================= */
export default function HomePage() {
  const heroSlides = useMemo<HeroSlide[]>(
    () => [
      {
        id: "h1",
        badge: "Productos",
        title: "Explora tu catálogo en segundos",
        subtitle: "Aquí podrás encontrar productos de calidad al mejor precio.",
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
      {
        id: "h3",
        badge: "Nuevos • Actualizaciones",
        title: "Lo más nuevo y lo más vendido",
        subtitle: "Ten a la mano lo que más se mueve en tu operación.",
        ctaText: "Explorar",
        ctaHref: "/productos",
        image:
          "https://images.unsplash.com/photo-1523966211575-eb4a01e7dd51?auto=format&fit=crop&w=2400&q=70",
      },
      {
        id: "h4",
        badge: "Operadora Balles",
        title: "Diseño Versión 1.0",
        subtitle: "Simple y fácil.",
        ctaText: "Contacto",
        ctaHref: "/contacto",
        image:
          "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=2400&q=70",
      },
    ],
    []
  )

  const slides: PanelSlide[] = useMemo(
    () => [
      {
        titleLeft: "Recomendados",
        badgeRight: "Top Ventas",
        items: [
          {
            name: "Leche 1.5 LT",
            sub: "Lácteos",
            price: 46.5,
            image:
              "https://images.unsplash.com/photo-1585238342028-4bcb2f56b1f1?auto=format&fit=crop&w=1200&q=70",
          },
          {
            name: "Aceite 1L",
            sub: "Abarrotes",
            price: 55.0,
            image:
              "https://images.unsplash.com/photo-1604908177453-746d7d1b4f0b?auto=format&fit=crop&w=1200&q=70",
          },
        ],
      },
      {
        titleLeft: "Recomendados",
        badgeRight: "Nuevos",
        items: [
          {
            name: "Servilletas",
            sub: "Desechables",
            price: 25.0,
            image:
              "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=1200&q=70",
          },
          {
            name: "Jabón",
            sub: "Limpieza",
            price: 39.0,
            image:
              "https://images.unsplash.com/photo-1583947581924-860bda1ec3b7?auto=format&fit=crop&w=1200&q=70",
          },
        ],
      },
      {
        titleLeft: "Recomendados",
        badgeRight: "Promos",
        items: [
          {
            name: "Refresco",
            sub: "Bebidas",
            price: 18.0,
            image:
              "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=70",
          },
          {
            name: "Galletas",
            sub: "Abarrotes",
            price: 22.0,
            image:
              "https://images.unsplash.com/photo-1584270354949-1f0b7d9b73e1?auto=format&fit=crop&w=1200&q=70",
          },
        ],
      },
    ],
    []
  )

  const popular = useMemo(() => slides.flatMap((s) => s.items).slice(0, 6), [slides])

  return (
    <div className="relative">
      {/* ✅ HERO FULL WIDTH real (rompe max-w del layout) */}
      <FullBleed>
        <PrimeHeroSlider slides={heroSlides} autoPlay intervalMs={6500} />
      </FullBleed>

      {/* Resto normal (se queda dentro del max-w del layout) */}
      <section className="mx-auto max-w-7xl px-0 pt-10">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-4 py-2 text-xs font-extrabold text-slate-700 shadow-sm">
              <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-extrabold text-sky-700">
                Bike Delivery
              </span>
              <span className="text-slate-500">•</span>
              Catálogo Operadora Balles
            </div>

            <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl">
              El catálogo más <br />
              rápido en <span className="text-sky-600">tu ciudad</span>
            </h1>

            <p className="max-w-lg text-sm leading-relaxed text-slate-500">
              Un catálogo elegante para consultar productos, precios y disponibilidad, y generar
              pedidos de forma rápida.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/productos"
                className="rounded-2xl px-6 py-3 text-sm font-extrabold text-white shadow-[0_18px_45px_-25px_rgba(2,132,199,.6)]"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(56,189,248,.95), rgba(37,99,235,.92))",
                }}
              >
                Ver catálogo
              </Link>

              <button
                type="button"
                className="group inline-flex items-center gap-3 text-sm font-extrabold text-slate-700"
              >
                <span className="grid h-12 w-12 place-items-center rounded-full bg-white shadow-[0_12px_30px_-18px_rgba(15,23,42,.35)] ring-1 ring-slate-200 transition group-hover:scale-[1.02]">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200">
                    ▶
                  </span>
                </span>
                Order Process
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <CatalogPanelCarousel slides={slides} autoPlay intervalMs={4200} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="mt-12 rounded-3xl bg-white shadow-[0_26px_90px_-60px_rgba(15,23,42,.55)] ring-1 ring-slate-200"
        >
          <div className="grid divide-y divide-slate-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <Info title="Today 10:00am – 10:00pm" sub="Working time" />
            <Info title="Hidalgo, MX • Operadora Balles" sub="Our location" />
            <Info title="+52 771 000 0000" sub="Call online" />
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-0 pb-16 pt-16">
        <div className="text-center">
          <div className="text-xs font-bold text-slate-400">Productos</div>
          <h2 className="mt-1 text-2xl font-extrabold text-slate-900">Productos más vendidos</h2>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((p, idx) => (
            <motion.div
              key={p.name + idx}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.35, delay: idx * 0.03 }}
              className="overflow-hidden rounded-3xl bg-white shadow-[0_26px_90px_-60px_rgba(15,23,42,.55)] ring-1 ring-slate-200"
            >
              <div className="relative h-44">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt="" className="h-full w-full object-cover" />
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-base font-extrabold text-slate-900">{p.name}</div>
                    <div className="text-xs font-semibold text-slate-400">★ 4.8</div>
                  </div>
                  <div className="text-sm font-extrabold text-slate-700">${money(p.price)}</div>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="rounded-xl bg-sky-600 px-4 py-2 text-xs font-extrabold text-white shadow-[0_14px_35px_-22px_rgba(2,132,199,.55)] transition hover:brightness-95"
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/productos"
            className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-extrabold text-slate-800 shadow-[0_26px_90px_-60px_rgba(15,23,42,.55)] ring-1 ring-slate-200"
          >
            See More Product{" "}
            <span className="grid h-9 w-9 place-items-center rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200">
              →
            </span>
          </Link>
        </div>
      </section>
    </div>
  )
}
