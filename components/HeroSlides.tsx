"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

type Item = {
  name: string
  sub: string
  price: number
  image: string
}

type Slide = {
  title?: string
  items: Item[] // 4 items por slide
}

function money(n: number) {
  return n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function HeroRightSlides({
  slides,
  autoPlay = true,
  intervalMs = 5000,
}: {
  slides: Slide[]
  autoPlay?: boolean
  intervalMs?: number
}) {
  const [index, setIndex] = useState(0)
  const count = slides.length

  // autoplay
  useEffect(() => {
    if (!autoPlay || count <= 1) return
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % count)
    }, intervalMs)
    return () => window.clearInterval(t)
  }, [autoPlay, intervalMs, count])

  const safeIndex = useMemo(() => Math.max(0, Math.min(index, count - 1)), [index, count])

  return (
    <div className="relative">
      <div className="relative rounded-[28px] bg-white p-6 shadow-[0_40px_120px_-70px_rgba(15,23,42,.5)] ring-1 ring-slate-200">
        <div className="flex items-center justify-between">
          <div className="text-sm font-extrabold text-slate-900">Recomendados</div>
          <div className="text-xs font-semibold text-slate-500">
            {slides[safeIndex]?.title ?? "Neon Blue"}
          </div>
        </div>

        {/* viewport */}
        <div className="mt-4 overflow-hidden">
          {/* track */}
          <motion.div
            className="flex"
            animate={{ x: `-${safeIndex * 100}%` }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            style={{ width: `${count * 100}%` }}
          >
            {slides.map((s, si) => (
              <div key={si} className="w-full shrink-0 px-0" style={{ width: `${100 / count}%` }}>
                {/* 2x2 cards */}
                <div className="grid grid-cols-2 gap-5">
                  {s.items.slice(0, 4).map((it) => (
                    <motion.div
                      key={it.name + it.image}
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.15 }}
                      className="rounded-2xl bg-white p-3 ring-1 ring-slate-200 shadow-[0_16px_45px_-34px_rgba(15,23,42,.35)]"
                    >
                      <div className="relative h-24 overflow-hidden rounded-2xl bg-slate-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={it.image} alt="" className="h-full w-full object-cover" />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/50 to-transparent" />
                      </div>

                      <div className="mt-3">
                        <div className="text-sm font-extrabold text-slate-900">{it.name}</div>
                        <div className="text-[11px] font-semibold text-slate-400">{it.sub}</div>
                        <div className="mt-2 text-xs font-extrabold text-slate-700">
                          ${money(it.price)}
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <button
                            type="button"
                            className="grid h-9 w-9 place-items-center rounded-full bg-white ring-1 ring-slate-200 shadow-sm transition hover:scale-[1.02]"
                            aria-label="Agregar"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            className="grid h-9 w-9 place-items-center rounded-full bg-sky-600 text-white shadow-sm transition hover:brightness-95"
                            aria-label="Ver"
                          >
                            →
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* dots */}
        <div className="mt-5 flex items-center justify-center gap-2">
          {slides.map((_, i) => {
            const active = i === safeIndex
            return (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Ir al slide ${i + 1}`}
                className="group rounded-full p-1"
              >
                <span
                  className={[
                    "block h-2.5 rounded-full transition-all",
                    active ? "w-7 bg-sky-600" : "w-2.5 bg-slate-300 group-hover:bg-slate-400",
                  ].join(" ")}
                />
              </button>
            )
          })}
        </div>
      </div>

      {/* glow */}
      <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[40px] bg-gradient-to-r from-sky-200/35 via-blue-200/20 to-cyan-200/30 blur-2xl" />
    </div>
  )
}
