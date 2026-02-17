"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { clearCart, getCart, removeFromCart, setQty, type CartItem } from "@/lib/cart"

function cn(...s: Array<string | false | null | undefined>) {
  return s.filter(Boolean).join(" ")
}

function money(n: number) {
  return n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function CarritoPage() {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    setItems(getCart())
  }, [])

  const total = useMemo(() => items.reduce((acc, x) => acc + x.price * x.qty, 0), [items])
  const itemsCount = useMemo(() => items.length, [items])
  const unitsCount = useMemo(() => items.reduce((acc, x) => acc + x.qty, 0), [items])

  // (Opcional) Si después quieres IVA o cargos extra, calcula aquí.
  const estimatedTax = useMemo(() => 0, [])
  const grandTotal = useMemo(() => total + estimatedTax, [total, estimatedTax])

  const empty = items.length === 0

  return (
    <section className="relative space-y-5 sm:space-y-7">
      {/* Neon Clear background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-110px] h-[280px] w-[560px] -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-300/35 via-indigo-300/25 to-fuchsia-300/35 blur-3xl" />
        <div className="absolute right-[-120px] top-[35%] h-[260px] w-[260px] rounded-full bg-gradient-to-br from-emerald-300/20 to-sky-300/20 blur-3xl" />
        <div className="absolute left-[-120px] top-[60%] h-[260px] w-[260px] rounded-full bg-gradient-to-br from-amber-300/20 to-rose-300/20 blur-3xl" />
      </div>

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">Carrito</h1>
          <p className="mt-1 text-sm text-slate-600">
            Ajusta cantidades y genera tu pedido cuando estés listo.
          </p>

          {/* Mini chips */}
          {!empty && (
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-3 py-1.5 text-xs text-slate-700 backdrop-blur-xl">
                <span className="h-2 w-2 rounded-full bg-sky-400" />
                {itemsCount} productos
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-3 py-1.5 text-xs text-slate-700 backdrop-blur-xl">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                {unitsCount} unidades
              </span>

              {/* ✨ TOQUE FINAL:
                  - Chip "Total" con mini glow + animación suave.
                  - Si quieres MÁS glow: sube los /35 -> /50 y blur-xl -> blur-2xl.
              */}
              <span className="relative inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-3 py-1.5 text-xs text-slate-700 backdrop-blur-xl overflow-hidden">
                <span className="pointer-events-none absolute -inset-6 opacity-60 animate-pulse rounded-full bg-gradient-to-r from-cyan-300/35 via-indigo-300/25 to-fuchsia-300/35 blur-xl" />
                <span className="relative z-10 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-fuchsia-400" />
                  Total: <span className="font-semibold text-slate-900">${money(grandTotal)}</span>
                </span>
              </span>
            </div>
          )}
        </div>

        {/* ✅ SOLO UN BOTÓN DE VACIAR (aquí arriba) */}
        {!empty && (
          <button
            className={cn(
              "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold",
              "border border-white/70 bg-white/60 backdrop-blur-xl",
              "shadow-[0_10px_30px_rgba(2,6,23,0.08)] hover:bg-white/75 transition"
            )}
            onClick={() => {
              clearCart()
              setItems([])
            }}
          >
            Vaciar
          </button>
        )}
      </div>

      {/* Empty state */}
      {empty ? (
        <div className="rounded-2xl border border-white/60 bg-white/60 backdrop-blur-xl shadow-[0_10px_30px_rgba(2,6,23,0.08)] p-6 text-center">
          <div className="mx-auto mb-2 h-10 w-10 rounded-2xl bg-white/70 border border-white/70" />
          <div className="font-semibold text-slate-900">Tu carrito está vacío</div>
          <div className="text-sm text-slate-600 mt-1">Explora el catálogo y agrega productos.</div>

          <div className="mt-4 flex justify-center">
            <Link
              className={cn(
                "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold",
                "bg-slate-900 text-white shadow-[0_18px_60px_rgba(2,6,23,0.22)] hover:opacity-95 transition"
              )}
              href="/productos"
            >
              Ir a productos
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1fr_360px] lg:items-start">
          {/* LEFT: items */}
          <div className="space-y-3 sm:space-y-4">
            {items.map((x) => {
              const sub = x.price * x.qty

              return (
                <div
                  key={x.id}
                  className={cn(
                    "group rounded-2xl border border-white/60 bg-white/60 backdrop-blur-xl",
                    "shadow-[0_10px_30px_rgba(2,6,23,0.08)] hover:shadow-[0_18px_60px_rgba(2,6,23,0.12)]",
                    "transition hover:-translate-y-[2px]"
                  )}
                >
                  <div className="p-4 sm:p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Left info */}
                    <div className="min-w-0">
                      <div className="flex items-start justify-between gap-3 sm:block">
                        <div className="min-w-0">
                          <div className="text-sm sm:text-base font-semibold text-slate-900 truncate">
                            {x.name}
                          </div>
                          <div className="mt-1 text-xs text-slate-500 truncate">{x.id}</div>
                        </div>

                        {/* Subtotal (mobile top-right) */}
                        <div className="sm:hidden shrink-0 text-sm font-semibold text-slate-900">
                          ${money(sub)}
                        </div>
                      </div>

                      <div className="mt-2 inline-flex items-center gap-2 rounded-xl border border-white/70 bg-white/70 px-3 py-2 text-sm">
                        <span className="text-slate-500">Precio</span>
                        <span className="font-semibold text-slate-900">${money(x.price)}</span>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <div className="inline-flex items-center rounded-2xl border border-white/70 bg-white/70 p-1">
                        <button
                          aria-label="Disminuir"
                          className="h-10 w-10 rounded-xl border border-transparent bg-white/70 hover:bg-white transition text-lg font-semibold"
                          onClick={() => {
                            const next = setQty(x.id, x.qty - 1)
                            setItems([...next])
                          }}
                        >
                          −
                        </button>

                        <div className="w-10 text-center font-semibold text-slate-900">{x.qty}</div>

                        <button
                          aria-label="Aumentar"
                          className="h-10 w-10 rounded-xl border border-transparent bg-white/70 hover:bg-white transition text-lg font-semibold"
                          onClick={() => {
                            const next = setQty(x.id, x.qty + 1)
                            setItems([...next])
                          }}
                        >
                          +
                        </button>
                      </div>

                      <button
                        className={cn(
                          "rounded-xl px-3 py-2 text-sm font-semibold",
                          "border border-white/70 bg-white/70 hover:bg-white/85 transition"
                        )}
                        onClick={() => {
                          const next = removeFromCart(x.id)
                          setItems([...next])
                        }}
                      >
                        Quitar
                      </button>

                      {/* Subtotal (desktop) */}
                      <div className="hidden sm:block ml-3 text-sm text-slate-600">
                        Subtotal{" "}
                        <span className="font-semibold text-slate-900">${money(sub)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* RIGHT: sticky summary */}
          <aside className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-white/60 bg-white/60 backdrop-blur-xl shadow-[0_10px_30px_rgba(2,6,23,0.08)]">
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Resumen</div>
                    <div className="mt-1 text-xs text-slate-500">Antes de generar tu PDF, revisa.</div>
                  </div>
                  <span className="inline-flex items-center rounded-full border border-white/70 bg-white/70 px-3 py-1.5 text-xs text-slate-700">
                    {itemsCount} prod • {unitsCount} uds
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between text-slate-700">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">${money(total)}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-700">
                    <span>Impuestos</span>
                    <span className="font-semibold text-slate-900">${money(estimatedTax)}</span>
                  </div>

                  <div className="my-3 h-px bg-slate-200/70" />

                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-semibold">Total</span>
                    <span className="text-lg font-black text-slate-900">${money(grandTotal)}</span>
                  </div>

                  <div className="mt-3 rounded-xl border border-white/70 bg-white/70 p-3 text-xs text-slate-600">
                    Tip: Si falta algo, toca <span className="font-semibold text-slate-900">Seguir comprando</span>.
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <Link
                    className={cn(
                      "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold",
                      "bg-slate-900 text-white shadow-[0_18px_60px_rgba(2,6,23,0.22)] hover:opacity-95 transition"
                    )}
                    href="/generar-pedido"
                  >
                    Generar pedido (PDF)
                  </Link>

                  <Link
                    className={cn(
                      "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold",
                      "border border-white/70 bg-white/60 backdrop-blur-xl",
                      "shadow-[0_10px_30px_rgba(2,6,23,0.08)] hover:bg-white/75 transition"
                    )}
                    href="/productos"
                  >
                    Seguir comprando
                  </Link>

                  {/* ✅ Quitado el botón duplicado de vaciar aquí */}
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </section>
  )
}
