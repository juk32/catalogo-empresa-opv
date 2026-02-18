"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
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
   Carrusel: TODO el panel es slide (por pixeles)
======================= */
function CatalogPanelCarousel({
  slides,
  autoPlay = true,
  intervalMs = 5200,
}: {
  slides: PanelSlide[]
  autoPlay?: boolean
  intervalMs?: number
}) {
  const [index, setIndex] = useState(0)
  const count = slides.length

  const viewportRef = useRef<HTMLDivElement | null>(null)
  const [w, setW] = useState(0)

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return

    const update = () => setW(el.getBoundingClientRect().width)
    update()

    const ro = new ResizeObserver(update)
    ro.observe(el)

    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!autoPlay || count <= 1) return
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % count)
    }, intervalMs)
    return () => window.clearInterval(t)
  }, [autoPlay, intervalMs, count])

  const x = -(index * w)

  return (
    <div className="relative">
      <div ref={viewportRef} className="overflow-hidden">
        <motion.div
          className="flex"
          animate={{ x: w ? x : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
          style={{ willChange: "transform" }}
        >
          {slides.map((slide, i) => (
            <div key={i} className="shrink-0" style={{ width: w ? `${w}px` : "100%" }}>
              <div className="relative rounded-[28px] bg-white shadow-[0_40px_120px_-70px_rgba(15,23,42,.5)] ring-1 ring-slate-200">
                <div className="flex items-center justify-between px-6 pt-6">
                  <div className="text-sm font-extrabold text-slate-900">{slide.titleLeft}</div>
                  <div className="text-xs font-semibold text-slate-500">{slide.badgeRight}</div>
                </div>

                <div className="px-6 pb-5 pt-4">
                  <div className="grid gap-5">
                    {slide.items.slice(0, 2).map((it) => (
                      <div
                        key={it.name + it.image}
                        className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-[0_16px_45px_-34px_rgba(15,23,42,.22)]"
                      >
                        <div className="relative h-32 overflow-hidden rounded-t-2xl bg-slate-50">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={it.image} alt="" className="h-full w-full object-cover" />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/60 to-transparent" />
                        </div>

                        <div className="p-4">
                          <div className="text-sm font-extrabold text-slate-900">{it.name}</div>
                          <div className="text-[11px] font-semibold text-slate-400">{it.sub}</div>

                          <div className="mt-2 text-sm font-extrabold text-slate-900">
                            ${money(it.price)}
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
                    ))}
                  </div>
                </div>

                <div className="pb-6">
                  <div className="flex items-center justify-center gap-2">
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
                              active
                                ? "w-7 bg-sky-600"
                                : "w-2.5 bg-slate-300 hover:bg-slate-400",
                            ].join(" ")}
                          />
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
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
      {
        titleLeft: "Recomendados",
        badgeRight: "Recomendados",
        items: [
          {
            name: "Café",
            sub: "Bebidas",
            price: 89.0,
            image:
              "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=70",
          },
          {
            name: "Cereal",
            sub: "Abarrotes",
            price: 54.0,
            image:
              "https://images.unsplash.com/photo-1587049352845-4a9d8c0b7a78?auto=format&fit=crop&w=1200&q=70",
          },
        ],
      },
    ],
    []
  )

  const popular = useMemo(() => slides.flatMap((s) => s.items).slice(0, 6), [slides])

  return (
    <div className="relative">
      {/* HERO */}
      <section className="mx-auto max-w-7xl px-0 pt-2">
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
            <CatalogPanelCarousel slides={slides} autoPlay intervalMs={5200} />
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

      {/* LO DE ABAJO */}
      <section className="mx-auto max-w-7xl px-0 pb-16 pt-16">
        <div className="text-center">
          <div className="text-xs font-bold text-slate-400">Product</div>
          <h2 className="mt-1 text-2xl font-extrabold text-slate-900">Most Popular Items</h2>
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

