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

type Testimonial = {
  name: string
  role: string
  text: string
}

function cn(...s: Array<string | false | null | undefined>) {
  return s.filter(Boolean).join(" ")
}

/* =======================
   FullBleed
======================= */
function FullBleed({ children }: { children: React.ReactNode }) {
  return <div className="relative -mx-[calc((100vw-100%)/2)] w-[calc(100%+((100vw-100%)))]">{children}</div>
}

/* =======================
   HERO (texto + imagen)
   - Fondo del color de la página (blanco + glows)
   - Imagen SIN tarjeta/encierro
======================= */
function HeroAgencyLike() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Fondo: mismo color de la página */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-white" />

        {/* glows “Neon Clear” */}
        <div className="absolute -top-52 left-1/2 h-[680px] w-[1100px] -translate-x-1/2 rounded-full bg-sky-200/40 blur-[150px]" />
        <div className="absolute top-10 right-[-220px] h-[620px] w-[620px] rounded-full bg-fuchsia-200/25 blur-[160px]" />
        <div className="absolute bottom-[-260px] left-[-260px] h-[720px] w-[720px] rounded-full bg-rose-200/25 blur-[170px]" />

        {/* grain suave */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-multiply [background-image:radial-gradient(circle_at_1px_1px,rgba(15,23,42,.35)_1px,transparent_0)] [background-size:18px_18px]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1.45fr]">
          {/* TEXTO */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-4 py-2 text-xs font-extrabold text-slate-700 shadow-sm">
              <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-extrabold text-sky-700">
                Abarrotes & Mayoreo
              </span>
              <span className="text-slate-500">•</span>
              Catálogo Operadora Balles
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[0.98] tracking-tight text-slate-900">
              Todo tu abarrotes <br />
              con{" "}
              <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-rose-600 bg-clip-text text-transparent">
                precios claros
              </span>{" "}
              y pedidos rápidos
            </h1>

            <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-slate-600">
              Consulta lo más vendido, revisa disponibilidad y arma tu pedido en minutos. Diseñado para compras ágiles en
              tienda, cocina y operación diaria.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/productos"
                className="inline-flex items-center justify-center rounded-2xl px-7 py-3.5 text-sm font-extrabold text-white shadow-[0_22px_60px_-30px_rgba(37,99,235,.55)] transition hover:brightness-95 active:scale-[0.99]"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(56,189,248,.95), rgba(99,102,241,.92), rgba(244,63,94,.88))",
                }}
              >
                Ver abarrotes
              </Link>

              <Link
                href="/contacto"
                className="inline-flex items-center justify-center rounded-2xl border border-white/60 bg-white/60 px-7 py-3.5 text-sm font-extrabold text-slate-800 backdrop-blur transition hover:bg-white/80"
              >
                Contacto
              </Link>
            </div>
          </motion.div>

          {/* IMAGEN (SIN TARJETA) */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="relative"
          >
            {/* glows sutiles detrás */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70 blur-[95px]" />
            <div className="pointer-events-none absolute right-[-50px] top-8 -z-10 h-[340px] w-[340px] rounded-full bg-sky-200/35 blur-[120px]" />
            <div className="pointer-events-none absolute left-[-40px] bottom-0 -z-10 h-[360px] w-[360px] rounded-full bg-rose-200/30 blur-[130px]" />

            <div className="relative mx-auto w-full max-w-[980px]">
              <div className="relative h-[320px] sm:h-[440px] lg:h-[560px]">
                <img
                  src="/hero.png"
                  alt="Abarrotes"
                  loading="eager"
                  className="absolute inset-0 h-full w-full object-contain object-center select-none transform-gpu will-change-transform"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* =======================
   Carrusel continuo (marquee)
======================= */
function CutoutProductCard({ p }: { p: Item }) {
  return (
    <article
      className={cn(
        "group relative",
        "w-[320px] sm:w-[360px] lg:w-[390px]",
        "rounded-3xl",
        "ring-1 ring-slate-200/70",
        "bg-white/55 backdrop-blur",
        "shadow-[0_26px_90px_-70px_rgba(15,23,42,.45)]",
        "overflow-hidden"
      )}
    >
      <div className="relative h-44 sm:h-52 lg:h-56 bg-transparent">
        <div className="pointer-events-none absolute inset-0 opacity-80 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,.20),transparent_55%),radial-gradient(circle_at_80%_30%,rgba(244,63,94,.16),transparent_55%)]" />
        <img
          src={p.image}
          alt={p.name}
          className="absolute inset-0 h-full w-full object-contain p-5 select-none transform-gpu will-change-transform mix-blend-multiply"
          loading="lazy"
        />
      </div>

      <div className="px-5 pb-5 pt-3">
        <div className="text-sm font-extrabold text-slate-900 truncate">{p.name}</div>
        <div className="text-[11px] font-semibold text-slate-500">{p.sub}</div>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm font-extrabold text-slate-900">${money(p.price)}</div>
          <span className="text-[11px] font-semibold text-slate-400">Disponible</span>
        </div>
      </div>
    </article>
  )
}

function ContinuousMarquee({
  items,
  titleLeft,
  badgeRight,
  seconds = 22,
}: {
  items: Item[]
  titleLeft: string
  badgeRight: string
  seconds?: number
}) {
  const loopItems = useMemo(() => [...items, ...items], [items])

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="text-lg font-extrabold text-slate-900">{titleLeft}</div>
        <div className="text-xs font-bold bg-white/70 px-3 py-1 rounded-full ring-1 ring-slate-200">{badgeRight}</div>
      </div>

      <div
        className={cn(
          "relative overflow-hidden rounded-3xl",
          "bg-white/55 backdrop-blur",
          "ring-1 ring-slate-200/70",
          "shadow-[0_50px_140px_-90px_rgba(15,23,42,.55)]",
          "p-3 sm:p-4"
        )}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white/90 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white/90 to-transparent z-10" />

        <motion.div
          className={cn("flex gap-4 py-4 px-4", "will-change-transform", "transform-gpu")}
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: seconds, ease: "linear", repeat: Infinity }}
          style={{ width: "max-content" }}
        >
          {loopItems.map((p, idx) => (
            <CutoutProductCard key={`${p.name}-${idx}`} p={p} />
          ))}
        </motion.div>
      </div>
    </div>
  )
}

/* =======================
   Sección 4 cards (como tu screenshot azul)
======================= */
function InfoBlocksLikeExample() {
  const cards = [
    {
      title: "Precios actualizados",
      desc: "Consulta precios claros y vigentes para compras rápidas.",
      iconBg: "bg-rose-500/90",
      icon: "⟲",
    },
    {
      title: "Surtido por categorías",
      desc: "Abarrotes, bebidas, limpieza y desechables en un solo lugar.",
      iconBg: "bg-indigo-500/90",
      icon: "▦",
    },
    {
      title: "Promos y top ventas",
      desc: "Encuentra lo más vendido y promociones destacadas.",
      iconBg: "bg-amber-500/90",
      icon: "↗",
    },
    {
      title: "Disponibilidad",
      desc: "Revisa existencias antes de generar tu pedido.",
      iconBg: "bg-emerald-500/90",
      icon: "➤",
    },
  ]

  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-sky-50/80" />
      <div className="pointer-events-none absolute -top-20 left-10 h-72 w-72 rounded-full bg-sky-200/40 blur-[90px]" />
      <div className="pointer-events-none absolute -bottom-24 right-10 h-80 w-80 rounded-full bg-rose-200/35 blur-[100px]" />

      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-16">
        {/* (si no quieres este título, bórralo) */}
        <div className="text-center">
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">Todo tu abarrotes, más simple</div>
          <p className="mt-2 text-sm sm:text-base text-slate-500 max-w-2xl mx-auto">
            Menos vueltas: consulta, compara y arma pedidos con información clara.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <div key={c.title} className="rounded-2xl bg-white/90 ring-1 ring-slate-200 shadow-sm p-6 text-left">
              <div className="flex items-center gap-3">
                <div className={cn("grid h-10 w-10 place-items-center rounded-xl text-white", c.iconBg)}>
                  <span className="text-sm font-extrabold">{c.icon}</span>
                </div>
              </div>

              <div className="mt-4 text-sm font-extrabold text-slate-900">{c.title}</div>
              <p className="mt-2 text-[12px] leading-relaxed text-slate-500">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* =======================
   Testimonios + Subscribe (como antes)
======================= */
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
            TESTIMONIOS
          </div>
          <div className="mt-1 text-xl font-extrabold text-slate-900">Lo que dicen nuestros clientes</div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={prev} className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-slate-200 bg-white/70 hover:bg-white" aria-label="Prev">
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
        SUSCRÍBETE
      </div>
      <div className="mt-2 text-2xl font-extrabold text-slate-900">Recibe actualizaciones del catálogo</div>
      <p className="mt-2 text-sm text-slate-500">Déjanos tu correo para recibir productos nuevos y mejoras.</p>

      <div className="mt-6 mx-auto flex max-w-xl items-center overflow-hidden rounded-2xl ring-1 ring-slate-200 bg-white/80 backdrop-blur">
        <input className="h-12 flex-1 px-4 text-sm outline-none bg-transparent" placeholder="Tu correo" />
        <button
          className="h-12 px-5 text-sm font-extrabold text-white hover:brightness-95"
          style={{
            background:
              "linear-gradient(135deg, rgba(56,189,248,.95), rgba(99,102,241,.92), rgba(244,63,94,.88))",
          }}
        >
          Suscribirme
        </button>
      </div>
    </div>
  )
}

/* =======================
   Page
======================= */
export default function HomePage() {
  const recommended: Item[] = useMemo(
    () => [
      { name: "Servilletas", sub: "Desechables", price: 25, image: "/products/servilletas.png" },
      { name: "Jabón", sub: "Limpieza", price: 39, image: "/products/jabon.png" },
      { name: "Refresco", sub: "Bebidas", price: 18, image: "/products/refresco.png" },
      { name: "Galletas", sub: "Abarrotes", price: 22, image: "/products/galletas.png" },
      { name: "Leche 1.5 L", sub: "Lácteos", price: 46.5, image: "/products/leche.png" },
      { name: "Aceite 1 L", sub: "Abarrotes", price: 55, image: "/products/aceite.png" },
    ],
    []
  )

  const testimonials: Testimonial[] = useMemo(
    () => [
      {
        name: "Carlos Hernández",
        role: "Compras",
        text: "Muy práctico: encuentro productos rápido, precios claros y el pedido se genera en minutos. Facilita mucho la operación.",
      },
      {
        name: "Norma Pérez",
        role: "Administración",
        text: "La vista es limpia y rápida. Me gusta que todo esté ordenado y que se sienta profesional.",
      },
      {
        name: "Luis Martínez",
        role: "Operación",
        text: "En celular funciona excelente. Para consulta rápida del día a día está perfecto.",
      },
      {
        name: "Emili Pérez",
        role: "Cliente",
        text: "El catálogo nos ahorra tiempo; es fácil comparar y decidir qué surtir.",
      },
    ],
    []
  )

  return (
    <div className="relative">
      {/* 1) HERO */}
      <FullBleed>
        <HeroAgencyLike />
      </FullBleed>

      {/* 2) CARRUSEL ABAJO */}
      <section className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 -mt-2 pb-14">
        <ContinuousMarquee items={recommended} titleLeft="Recomendados" badgeRight="Top ventas" seconds={22} />
      </section>

      {/* 3) BLOQUE AZUL DE 4 CARDS */}
      <FullBleed>
        <InfoBlocksLikeExample />
      </FullBleed>

      {/* 4) TESTIMONIOS */}
      <section className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-12">
        <TestimonialsCarousel items={testimonials} />
      </section>

      {/* 5) SUBSCRIBE */}
      <section className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 pb-14">
        <SubscribeBlock />
      </section>
    </div>
  )
}