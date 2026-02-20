"use client"

import Link from "next/link"
import React, { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

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

type Testimonial = {
  name: string
  role: string
  text: string
}

/* =======================
   FullBleed
======================= */
function FullBleed({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative -mx-[calc((100vw-100%)/2)] w-[calc(100%+((100vw-100%)))]">
      {children}
    </div>
  )
}

/* =======================
   HERO SUPERIOR (Azul/Rojo)
======================= */
function HeroAgencyLike() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute -top-52 left-1/2 h-[680px] w-[1100px] -translate-x-1/2 rounded-full bg-sky-200/40 blur-[150px]" />
        <div className="absolute top-10 right-[-220px] h-[620px] w-[620px] rounded-full bg-fuchsia-200/30 blur-[160px]" />
        <div className="absolute bottom-[-260px] left-[-260px] h-[720px] w-[720px] rounded-full bg-rose-200/30 blur-[170px]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="text-sm font-extrabold text-slate-900">
              Operadora<span className="text-sky-600">Balles</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight text-slate-900">
              El catálogo más <br />
              rápido en{" "}
              <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-rose-600 bg-clip-text text-transparent">
                tu ciudad
              </span>
            </h1>

            <p className="max-w-xl text-sm sm:text-base leading-relaxed text-slate-600">
              Un catálogo elegante para consultar productos, precios y disponibilidad, y generar pedidos de forma rápida.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/productos"
                className="inline-flex items-center justify-center rounded-2xl px-7 py-3 text-sm font-extrabold text-white shadow-[0_18px_45px_-25px_rgba(37,99,235,.45)] transition hover:brightness-95"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(56,189,248,.95), rgba(99,102,241,.92), rgba(244,63,94,.88))",
                }}
              >
                Ver catálogo
              </Link>

              <Link
                href="/contacto"
                className="inline-flex items-center justify-center rounded-2xl border border-white/60 bg-white/60 px-7 py-3 text-sm font-extrabold text-slate-800 backdrop-blur transition hover:bg-white/80"
              >
                Contacto
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="relative"
          >
            <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60 blur-[95px]" />
            <div className="pointer-events-none absolute right-0 top-10 -z-10 h-[320px] w-[320px] rounded-full bg-sky-200/35 blur-[110px]" />
            <div className="pointer-events-none absolute left-0 bottom-0 -z-10 h-[320px] w-[320px] rounded-full bg-rose-200/30 blur-[120px]" />

            <div className="relative h-[320px] sm:h-[420px] lg:h-[520px]">
              <img
                src="/hero.png"
                alt="Hero"
                className="absolute inset-0 h-full w-full object-contain object-bottom drop-shadow-[0_50px_80px_rgba(15,23,42,.18)]"
              />
            </div>

            {[
              { pos: "left-4 top-6", label: "★" },
              { pos: "right-6 top-10", label: "✓" },
              { pos: "left-8 bottom-10", label: "⟲" },
              { pos: "right-8 bottom-12", label: "☰" },
            ].map((x) => (
              <div
                key={x.pos}
                className={[
                  "absolute grid h-12 w-12 place-items-center rounded-2xl bg-white/65 backdrop-blur ring-1 ring-slate-200 shadow-sm",
                  x.pos,
                ].join(" ")}
              >
                <span className="text-lg font-extrabold bg-gradient-to-r from-sky-600 via-indigo-600 to-rose-600 bg-clip-text text-transparent">
                  {x.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* =======================
   Card Full Image + Fade
======================= */
function FullImageCard({
  item,
  slideIndex,
  keyId,
}: {
  item?: Item
  slideIndex: number
  keyId: string
}) {
  if (!item) return null

  return (
    <div className="relative h-[230px] overflow-hidden rounded-3xl ring-1 ring-slate-200 shadow-[0_18px_70px_-55px_rgba(15,23,42,.55)] bg-slate-50">
      <AnimatePresence mode="wait">
        <motion.img
          key={`${keyId}-${item.image}-${slideIndex}`}
          src={item.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/90 via-white/45 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/25 via-transparent to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="text-lg font-extrabold text-slate-900">{item.name}</div>
        <div className="text-xs font-semibold text-slate-500">{item.sub}</div>
        <div className="mt-2 text-base font-extrabold text-slate-900">${money(item.price)}</div>
      </div>
    </div>
  )
}

/* =======================
   Panel Recomendados
======================= */
function CatalogPanelCarousel({
  slides,
  autoPlay = true,
  intervalMs = 4000,
}: {
  slides: PanelSlide[]
  autoPlay?: boolean
  intervalMs?: number
}) {
  const [index, setIndex] = useState(0)
  const count = slides.length

  useEffect(() => {
    if (!autoPlay || count <= 1) return
    const t = setInterval(() => setIndex((i) => (i + 1) % count), intervalMs)
    return () => clearInterval(t)
  }, [autoPlay, intervalMs, count])

  const s = slides[index]
  if (!s) return null

  const mobileItems = slides.flatMap((x) => x.items)

  return (
    <div className="relative">
      {/* MOBILE */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between px-1">
          <div className="text-sm font-extrabold text-slate-900">Recomendados</div>
          <div className="text-xs font-extrabold text-slate-500">Desliza →</div>
        </div>

        <div className="mt-3 overflow-x-auto pb-2">
          <div className="flex gap-4 pr-3">
            {mobileItems.map((it, i) => (
              <div
                key={it.name + i}
                className="min-w-[240px] overflow-hidden rounded-3xl bg-white/90 ring-1 ring-slate-200 shadow-[0_26px_90px_-70px_rgba(15,23,42,.55)]"
              >
                <div className="relative h-32 bg-slate-50">
                  <img src={it.image} alt="" className="h-full w-full object-cover" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/55 to-transparent" />
                </div>
                <div className="p-4">
                  <div className="text-sm font-extrabold text-slate-900">{it.name}</div>
                  <div className="text-[11px] font-semibold text-slate-400">{it.sub}</div>
                  <div className="mt-2 text-sm font-extrabold text-slate-900">${money(it.price)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DESKTOP */}
      <div className="hidden sm:block">
        <div className="rounded-3xl bg-white/70 p-6 shadow-[0_40px_120px_-70px_rgba(15,23,42,.5)] ring-1 ring-slate-200 backdrop-blur">
          <div className="flex items-center justify-between mb-6">
            <div className="text-lg font-extrabold">{s.titleLeft}</div>
            <div className="text-xs font-bold bg-white/70 px-3 py-1 rounded-full ring-1 ring-slate-200">
              {s.badgeRight}
            </div>
          </div>

          <div className="grid gap-5">
            <FullImageCard item={s.items?.[0]} slideIndex={index} keyId="top" />
            <FullImageCard item={s.items?.[1]} slideIndex={index} keyId="bottom" />
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {slides.map((_, i) => {
              const active = i === index
              return (
                <button key={i} onClick={() => setIndex(i)} className="rounded-full p-1" aria-label={`Slide ${i + 1}`}>
                  <span
                    className={[
                      "block h-2.5 rounded-full transition-all",
                      active
                        ? "w-8 bg-gradient-to-r from-sky-600 via-indigo-600 to-rose-600"
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
  )
}

/* =======================
   Extra sections
======================= */
function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-3xl bg-white/70 backdrop-blur ring-1 ring-slate-200 p-6 shadow-[0_26px_90px_-70px_rgba(15,23,42,.35)]">
      <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-sky-100 text-sky-700 ring-1 ring-sky-200">
        {icon}
      </div>
      <div className="text-base font-extrabold text-slate-900">{title}</div>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">{desc}</p>
      <div className="mt-4 text-sm font-extrabold text-slate-900 inline-flex items-center gap-2">
        Learn More <span>→</span>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-3 h-10 w-10 rounded-2xl bg-gradient-to-br from-sky-200 to-rose-200 ring-1 ring-white/60" />
      <div className="text-xs font-semibold text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-extrabold bg-gradient-to-r from-sky-600 via-indigo-600 to-rose-600 bg-clip-text text-transparent">
        {value}
      </div>
    </div>
  )
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="rounded-2xl bg-white/80 backdrop-blur ring-1 ring-slate-200 p-5 shadow-[0_18px_50px_-45px_rgba(15,23,42,.35)]">
      <p className="text-sm leading-relaxed text-slate-600">{t.text}</p>
      <div className="mt-4 flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-sky-200 to-rose-200 ring-1 ring-white/70" />
        <div>
          <div className="text-sm font-extrabold text-slate-900">{t.name}</div>
          <div className="text-[11px] font-semibold text-slate-500">{t.role}</div>
        </div>
      </div>
    </div>
  )
}

function TestimonialsCarousel({ items }: { items: Testimonial[] }) {
  const [i, setI] = useState(0)
  const prev = () => setI((v) => (v - 1 + items.length) % items.length)
  const next = () => setI((v) => (v + 1) % items.length)

  const visible = useMemo(() => {
    const arr: Testimonial[] = []
    for (let k = 0; k < 3; k++) arr.push(items[(i + k) % items.length])
    return arr
  }, [i, items])

  return (
    <div className="rounded-3xl bg-white/70 backdrop-blur ring-1 ring-slate-200 shadow-[0_26px_90px_-70px_rgba(15,23,42,.35)] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[11px] font-extrabold bg-gradient-to-r from-sky-600 via-indigo-600 to-rose-600 bg-clip-text text-transparent">
            TESTIMONIALS
          </div>
          <div className="mt-1 text-xl font-extrabold text-slate-900">See What Our Customer Say About Us</div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-slate-200 bg-white/70 hover:bg-white"
            aria-label="Prev"
          >
            ←
          </button>
          <button
            onClick={next}
            className="grid h-10 w-10 place-items-center rounded-full text-white hover:brightness-95"
            aria-label="Next"
            style={{
              background:
                "linear-gradient(135deg, rgba(56,189,248,.95), rgba(99,102,241,.92), rgba(244,63,94,.88))",
            }}
          >
            →
          </button>
        </div>
      </div>

      <div className="mt-6 sm:hidden">
        <TestimonialCard t={items[i]} />
      </div>

      <div className="mt-6 hidden sm:grid sm:grid-cols-3 gap-5">
        {visible.map((t, idx) => (
          <TestimonialCard key={t.name + idx} t={t} />
        ))}
      </div>
    </div>
  )
}

function SubscribeBlock() {
  return (
    <div className="rounded-3xl bg-white/70 backdrop-blur ring-1 ring-slate-200 shadow-[0_26px_90px_-70px_rgba(15,23,42,.35)] p-8 text-center">
      <div className="text-[11px] font-extrabold bg-gradient-to-r from-sky-600 via-indigo-600 to-rose-600 bg-clip-text text-transparent">
        SUBSCRIBE
      </div>
      <div className="mt-2 text-2xl font-extrabold text-slate-900">Subscribe To Get The Latest News About Us</div>
      <p className="mt-2 text-sm text-slate-500">
        Déjanos tu correo para recibir actualizaciones de productos y mejoras del catálogo.
      </p>

      <div className="mt-6 mx-auto flex max-w-xl items-center overflow-hidden rounded-2xl ring-1 ring-slate-200 bg-white/80 backdrop-blur">
        <input className="h-12 flex-1 px-4 text-sm outline-none bg-transparent" placeholder="Enter your email address" />
        <button
          className="h-12 px-5 text-sm font-extrabold text-white hover:brightness-95"
          style={{
            background:
              "linear-gradient(135deg, rgba(56,189,248,.95), rgba(99,102,241,.92), rgba(244,63,94,.88))",
          }}
        >
          Subscribe
        </button>
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
            name: "Servilletas",
            sub: "Desechables",
            price: 25,
            image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=1400&q=70",
          },
          {
            name: "Jabón",
            sub: "Limpieza",
            price: 39,
            image: "https://images.unsplash.com/photo-1583947581924-860bda1ec3b7?auto=format&fit=crop&w=1400&q=70",
          },
        ],
      },
      {
        titleLeft: "Recomendados",
        badgeRight: "Nuevos",
        items: [
          {
            name: "Refresco",
            sub: "Bebidas",
            price: 18,
            image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1400&q=70",
          },
          {
            name: "Galletas",
            sub: "Abarrotes",
            price: 22,
            image: "https://images.unsplash.com/photo-1584270354949-1f0b7d9b73e1?auto=format&fit=crop&w=1400&q=70",
          },
        ],
      },
      {
        titleLeft: "Recomendados",
        badgeRight: "Promos",
        items: [
          {
            name: "Leche 1.5 LT",
            sub: "Lácteos",
            price: 46.5,
            image: "https://images.unsplash.com/photo-1585238342028-4bcb2f56b1f1?auto=format&fit=crop&w=1400&q=70",
          },
          {
            name: "Aceite 1L",
            sub: "Abarrotes",
            price: 55,
            image: "https://images.unsplash.com/photo-1604908177453-746d7d1b4f0b?auto=format&fit=crop&w=1400&q=70",
          },
        ],
      },
    ],
    []
  )

  const popular = useMemo(() => slides.flatMap((s) => s.items).slice(0, 6), [slides])

  const testimonials: Testimonial[] = useMemo(
    () => [
      {
        name: "Emily Stones",
        role: "CEO, Marketing Guru",
        text: "Thank You for your service. I am very pleased with the result. I have seen exponential growth in my business and it is all thanks to your amazing service.",
      },
      {
        name: "Carlos Hernández",
        role: "Compras",
        text: "Muy práctico: encontré productos rápido, precios claros y el pedido se genera en minutos. Facilita mucho la operación.",
      },
      {
        name: "Norma Pérez",
        role: "Administración",
        text: "La vista es limpia y rápida. Me gusta que todo esté ordenado y que el panel de recomendados se vea profesional.",
      },
      {
        name: "Luis Martínez",
        role: "Operación",
        text: "La experiencia en celular quedó excelente, especialmente para consultar rápido lo que necesitamos en el día.",
      },
    ],
    []
  )

  return (
    <div className="relative">
      {/* HERO */}
      <FullBleed>
        <HeroAgencyLike />
      </FullBleed>

      {/* BLOQUE PRINCIPAL */}
      <section className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 pt-10">
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

            <h2 className="text-4xl sm:text-5xl font-extrabold leading-[1.05] tracking-tight text-slate-900">
              El catálogo más <br />
              rápido en{" "}
              <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-rose-600 bg-clip-text text-transparent">
                tu ciudad
              </span>
            </h2>

            <p className="max-w-lg text-sm leading-relaxed text-slate-500">
              Un catálogo elegante para consultar productos, precios y disponibilidad, y generar pedidos de forma rápida.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/productos"
                className="rounded-2xl px-6 py-3 text-sm font-extrabold text-white shadow-[0_18px_45px_-25px_rgba(2,132,199,.6)] transition hover:brightness-95"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(56,189,248,.95), rgba(99,102,241,.92), rgba(244,63,94,.88))",
                }}
              >
                Ver catálogo
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <CatalogPanelCarousel slides={slides} autoPlay intervalMs={4200} />
          </motion.div>
        </div>
      </section>

      {/* POPULARES */}
      <section className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 pb-16 pt-16">
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
                    className="rounded-xl px-4 py-2 text-xs font-extrabold text-white transition hover:brightness-95"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(56,189,248,.95), rgba(99,102,241,.92), rgba(244,63,94,.88))",
                    }}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* WHAT WE DO + STATS */}
      <section className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-16">
        <div className="text-left">
          <div className="text-[11px] font-extrabold bg-gradient-to-r from-sky-600 via-indigo-600 to-rose-600 bg-clip-text text-transparent">
            WHAT WE DO
          </div>
          <h3 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 max-w-2xl">
            We provide the Perfect Solution <br className="hidden sm:block" />
            to your business growth
          </h3>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<span className="font-extrabold">↗</span>}
            title="Grow Your Business"
            desc="Consulta y encuentra productos en segundos con diseño rápido."
          />
          <FeatureCard
            icon={<span className="font-extrabold">♡</span>}
            title="Improve brand loyalty"
            desc="Una experiencia consistente mejora la confianza y reduce fricción."
          />
          <FeatureCard
            icon={<span className="font-extrabold">☁</span>}
            title="Improve Business Model"
            desc="Centraliza catálogo y pedidos para operar mejor y con menos errores."
          />
        </div>

        <div className="mt-14 rounded-3xl bg-white/60 backdrop-blur ring-1 ring-slate-200 p-8 shadow-[0_26px_90px_-70px_rgba(15,23,42,.25)]">
          <div className="grid gap-10 sm:grid-cols-4">
            <Stat label="Completed Projects" value="100+" />
            <Stat label="Customer Satisfaction" value="20%" />
            <Stat label="Raised by Clients" value="$10M" />
            <Stat label="Years in Business" value="2 yrs" />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-10">
        <TestimonialsCarousel items={testimonials} />
      </section>

      {/* SUBSCRIBE */}
      <section className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 pb-12">
        <SubscribeBlock />
      </section>
    </div>
  )
}