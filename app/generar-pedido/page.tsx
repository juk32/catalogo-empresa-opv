"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getCart, type CartItem, clearCart } from "@/lib/cart"

function cn(...s: Array<string | false | null | undefined>) {
  return s.filter(Boolean).join(" ")
}

function money(n: number) {
  return n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

type ToastType = "success" | "info" | "error"
type ToastState = { open: boolean; type: ToastType; title: string; message?: string }

export default function GenerarPedidoPage() {
  const router = useRouter()

  const [items, setItems] = useState<CartItem[]>([])
  const [customerName, setCustomerName] = useState("")
  const [deliveryAt, setDeliveryAt] = useState("") // datetime-local
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ✅ Toast (sin librerías)
  const [toast, setToast] = useState<ToastState>({
    open: false,
    type: "info",
    title: "",
    message: "",
  })

  function showToast(next: Omit<ToastState, "open">, ms = 2600) {
    setToast({ open: true, ...next })
    window.clearTimeout((showToast as any)._t)
    ;(showToast as any)._t = window.setTimeout(() => {
      setToast((t) => ({ ...t, open: false }))
    }, ms)
  }

  useEffect(() => {
    setItems(getCart())
  }, [])

  const total = useMemo(() => items.reduce((acc, x) => acc + x.price * x.qty, 0), [items])
  const itemsCount = useMemo(() => items.length, [items])
  const unitsCount = useMemo(() => items.reduce((acc, x) => acc + x.qty, 0), [items])

  // (Opcional) IVA/cargos
  const estimatedTax = useMemo(() => 0, [])
  const grandTotal = useMemo(() => total + estimatedTax, [total, estimatedTax])

  async function onGeneratePdf() {
    setError(null)

    if (items.length === 0) {
      const msg = "Tu carrito está vacío."
      setError(msg)
      showToast({ type: "error", title: "No se puede generar", message: msg })
      return
    }
    if (!customerName.trim()) {
      const msg = "Escribe el nombre del cliente."
      setError(msg)
      showToast({ type: "error", title: "Falta información", message: msg })
      return
    }

    setLoading(true)
    showToast({ type: "info", title: "Generando pedido…", message: "Estamos preparando el PDF." }, 2200)

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerName.trim(),
          deliveryAt: deliveryAt ? new Date(deliveryAt).toISOString() : null,
          items: items.map((x) => ({
            productId: x.id,
            name: x.name,
            unitPrice: x.price,
            qty: x.qty,
            unit: "PZ",
          })),
        }),
      })

      if (res.status === 401) {
        const callbackUrl = encodeURIComponent("/generar-pedido")
        router.push(`/login?callbackUrl=${callbackUrl}`)
        return
      }

      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error((data as any)?.error || "No se pudo generar el pedido")

      const orderId = (data as any)?.id as string | undefined
      if (!orderId) throw new Error("No se recibió el id del pedido")

      clearCart()
      setItems([])

      showToast(
        { type: "success", title: "Pedido generado ✅", message: "Descargando PDF…" },
        2500
      )

      window.location.href = `/api/orders/${orderId}/pdf`
    } catch (e: any) {
      const msg = e?.message ?? "Error al generar PDF"
      setError(msg)
      showToast({ type: "error", title: "Ocurrió un error", message: msg }, 3200)
    } finally {
      setLoading(false)
    }
  }

  const Toast = () => {
    if (!toast.open) return null

    const meta =
      toast.type === "success"
        ? {
            ring: "ring-emerald-300/40",
            bg: "bg-emerald-500/10",
            text: "text-emerald-800",
            dot: "bg-emerald-500",
          }
        : toast.type === "error"
        ? {
            ring: "ring-rose-300/40",
            bg: "bg-rose-500/10",
            text: "text-rose-800",
            dot: "bg-rose-500",
          }
        : {
            ring: "ring-sky-300/40",
            bg: "bg-sky-500/10",
            text: "text-sky-900",
            dot: "bg-sky-500",
          }

    return (
      <div className="fixed bottom-5 right-5 z-[999] w-[92vw] max-w-sm">
        <div
          className={cn(
            "rounded-2xl border border-white/60 bg-white/70 backdrop-blur-xl",
            "shadow-[0_18px_60px_rgba(2,6,23,0.18)] ring-1",
            meta.ring
          )}
        >
          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={cn("h-2.5 w-2.5 rounded-full", meta.dot)} />
                  <div className={cn("text-sm font-semibold truncate", meta.text)}>{toast.title}</div>
                </div>
                {toast.message ? (
                  <div className="mt-1 text-xs text-slate-600">{toast.message}</div>
                ) : null}
              </div>
              <button
                onClick={() => setToast((t) => ({ ...t, open: false }))}
                className={cn(
                  "shrink-0 rounded-xl px-2 py-1 text-xs font-semibold",
                  "border border-white/70 bg-white/70 hover:bg-white transition"
                )}
              >
                Cerrar
              </button>
            </div>

            <div className={cn("mt-3 rounded-xl px-3 py-2 text-xs", meta.bg, meta.text)}>
              Tip: Si algo falla, revisa el nombre del cliente y el carrito.
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Empty state
  if (items.length === 0) {
    return (
      <section className="relative space-y-5 sm:space-y-7">
        <Toast />

        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-[-110px] h-[280px] w-[560px] -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-300/35 via-indigo-300/25 to-fuchsia-300/35 blur-3xl" />
          <div className="absolute right-[-120px] top-[35%] h-[260px] w-[260px] rounded-full bg-gradient-to-br from-emerald-300/20 to-sky-300/20 blur-3xl" />
          <div className="absolute left-[-120px] top-[60%] h-[260px] w-[260px] rounded-full bg-gradient-to-br from-amber-300/20 to-rose-300/20 blur-3xl" />
        </div>

        <div className="rounded-2xl border border-white/60 bg-white/60 backdrop-blur-xl shadow-[0_10px_30px_rgba(2,6,23,0.08)] p-6 text-center">
          <div className="mx-auto mb-2 h-10 w-10 rounded-2xl bg-white/70 border border-white/70" />
          <div className="font-semibold text-slate-900">Generar pedido</div>
          <div className="text-sm text-slate-600 mt-1">No hay productos en el carrito.</div>

          <div className="mt-4 flex justify-center gap-2">
            <Link
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold bg-slate-900 text-white shadow-[0_18px_60px_rgba(2,6,23,0.22)] hover:opacity-95 transition"
              href="/productos"
            >
              Ir a productos
            </Link>
            <Link
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold border border-white/70 bg-white/60 backdrop-blur-xl shadow-[0_10px_30px_rgba(2,6,23,0.08)] hover:bg-white/75 transition"
              href="/carrito"
            >
              Ver carrito
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative space-y-5 sm:space-y-7">
      <Toast />

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-110px] h-[280px] w-[560px] -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-300/35 via-indigo-300/25 to-fuchsia-300/35 blur-3xl" />
        <div className="absolute right-[-120px] top-[35%] h-[260px] w-[260px] rounded-full bg-gradient-to-br from-emerald-300/20 to-sky-300/20 blur-3xl" />
        <div className="absolute left-[-120px] top-[60%] h-[260px] w-[260px] rounded-full bg-gradient-to-br from-amber-300/20 to-rose-300/20 blur-3xl" />
      </div>

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
            Generar pedido
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Captura cliente, programa entrega y genera el PDF.
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-3 py-1.5 text-xs text-slate-700 backdrop-blur-xl">
              <span className="h-2 w-2 rounded-full bg-sky-400" />
              {itemsCount} productos
            </span>

            <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-3 py-1.5 text-xs text-slate-700 backdrop-blur-xl">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              {unitsCount} unidades
            </span>

            <span className="relative inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-3 py-1.5 text-xs text-slate-700 backdrop-blur-xl overflow-hidden">
              <span className="pointer-events-none absolute -inset-6 opacity-60 animate-pulse rounded-full bg-gradient-to-r from-cyan-300/35 via-indigo-300/25 to-fuchsia-300/35 blur-xl" />
              <span className="relative z-10 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-fuchsia-400" />
                Total: <span className="font-semibold text-slate-900">${money(grandTotal)}</span>
              </span>
            </span>
          </div>
        </div>

        <Link
          className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold border border-white/70 bg-white/60 backdrop-blur-xl shadow-[0_10px_30px_rgba(2,6,23,0.08)] hover:bg-white/75 transition"
          href="/carrito"
        >
          Volver al carrito
        </Link>
      </div>

      {/* Layout */}
      <div className="grid gap-4 lg:grid-cols-[1fr_360px] lg:items-start">
        {/* LEFT */}
        <div className="space-y-4">
          {/* Cliente */}
          <div className="rounded-2xl border border-white/60 bg-white/60 backdrop-blur-xl shadow-[0_10px_30px_rgba(2,6,23,0.08)]">
            <div className="p-4 sm:p-5">
              <label className="block text-sm font-semibold text-slate-800">Nombre del cliente</label>
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ej. Hugo / Tienda X"
                className={cn(
                  "mt-2 w-full rounded-xl px-3 py-2.5 text-sm",
                  "border border-white/70 bg-white/70 text-slate-900 placeholder:text-slate-400",
                  "outline-none focus:ring-2 focus:ring-cyan-300/50"
                )}
              />
              <p className="mt-2 text-xs text-slate-500">Este nombre aparece en el PDF y en el historial.</p>
            </div>
          </div>

          {/* Horario */}
          <div className="rounded-2xl border border-white/60 bg-white/60 backdrop-blur-xl shadow-[0_10px_30px_rgba(2,6,23,0.08)]">
            <div className="p-4 sm:p-5">
              <label className="block text-sm font-semibold text-slate-800">
                Establecer día y hora de entrega <span className="text-slate-500">(opcional)</span>
              </label>

              <div className="relative mt-2">
                <input
                  type="datetime-local"
                  value={deliveryAt}
                  onChange={(e) => setDeliveryAt(e.target.value)}
                  className={cn(
                    "w-full rounded-xl px-3 py-2.5 text-sm pr-10",
                    "border border-white/70 bg-white/70 text-slate-900",
                    "outline-none focus:ring-2 focus:ring-cyan-300/50"
                  )}
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                  📅
                </span>
              </div>

              <p className="mt-2 text-xs text-slate-600">
                Si lo dejas vacío, se puede asignar/editar después en historial (ADMIN).
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="rounded-2xl border border-white/60 bg-white/60 backdrop-blur-xl shadow-[0_10px_30px_rgba(2,6,23,0.08)]">
            <div className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-900">Productos</div>
                <div className="text-xs text-slate-500">Revisa antes de generar</div>
              </div>

              <div className="mt-4 grid gap-3">
                {items.map((x) => (
                  <div key={x.id} className="rounded-2xl border border-white/70 bg-white/70 hover:bg-white/80 transition">
                    <div className="p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 truncate">{x.name}</div>
                        <div className="text-xs text-slate-500 truncate">{x.id}</div>
                      </div>

                      <div className="flex items-center justify-between gap-3 sm:justify-end">
                        <div className="text-xs text-slate-600">
                          <span className="font-semibold text-slate-900">{x.qty}</span> × ${money(x.price)}
                        </div>
                        <div className="text-sm font-semibold text-slate-900">
                          ${money(x.qty * x.price)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl border border-white/70 bg-white/70 p-3">
                <div className="text-sm font-semibold text-slate-800">Subtotal</div>
                <div className="text-sm font-black text-slate-900">${money(total)}</div>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
              {error}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <aside className="lg:sticky lg:top-24">
          <div className="rounded-2xl border border-white/60 bg-white/60 backdrop-blur-xl shadow-[0_10px_30px_rgba(2,6,23,0.08)]">
            <div className="p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Resumen</div>
                  <div className="mt-1 text-xs text-slate-500">Genera tu PDF cuando esté listo.</div>
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
                  Tip: Si algo falla, revisa el nombre del cliente y el carrito.
                </div>
              </div>

              <button
                onClick={onGeneratePdf}
                disabled={loading}
                className={cn(
                  "mt-4 w-full rounded-xl px-6 py-3 text-sm font-semibold text-white",
                  "shadow-[0_18px_60px_rgba(2,6,23,0.22)]",
                  "bg-gradient-to-r from-sky-600 via-indigo-600 to-rose-600 hover:brightness-95 transition",
                  loading ? "opacity-60 cursor-not-allowed" : ""
                )}
              >
                {loading ? "Generando..." : "Generar PDF"}
              </button>

              <Link
                href="/carrito"
                className={cn(
                  "mt-2 inline-flex w-full items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold",
                  "border border-white/70 bg-white/60 backdrop-blur-xl",
                  "shadow-[0_10px_30px_rgba(2,6,23,0.08)] hover:bg-white/75 transition"
                )}
              >
                Volver al carrito
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
