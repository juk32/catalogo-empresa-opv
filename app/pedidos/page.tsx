"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

type OrderRow = {
  id: string
  folio: string
  customerName: string
  status: "PENDIENTE" | "ENTREGADO"
  deliveryAt: string | null
  createdAt?: string
  deliveredAt?: string | null
  deliveredPlace?: string | null
}

function cn(...s: Array<string | false | null | undefined>) {
  return s.filter(Boolean).join(" ")
}

function fmtDate(v?: string | null) {
  if (!v) return "—"
  const d = new Date(v)
  if (isNaN(d.getTime())) return "—"
  return d.toLocaleString("es-MX", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function statusStyles(status: OrderRow["status"]) {
  if (status === "ENTREGADO") {
    return {
      label: "Entregado",
      pill: "bg-emerald-500/12 text-emerald-800 ring-1 ring-emerald-300/40",
      dot: "bg-emerald-500",
    }
  }
  return {
    label: "Pendiente",
    pill: "bg-amber-500/12 text-amber-900 ring-1 ring-amber-300/40",
    dot: "bg-amber-500",
  }
}

type ToastType = "success" | "info" | "error"
type ToastState = { open: boolean; type: ToastType; title: string; message?: string }

export default function PedidosPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [q, setQ] = useState("")

  // ✅ Modal entregar
  const [deliverOpen, setDeliverOpen] = useState(false)
  const [deliverOrder, setDeliverOrder] = useState<OrderRow | null>(null)
  const [deliveredAt, setDeliveredAt] = useState("")
  const [deliveredPlace, setDeliveredPlace] = useState("")
  const [delivering, setDelivering] = useState(false)
  const [deliverErr, setDeliverErr] = useState<string | null>(null)

  // ✅ Modal enviar WhatsApp
  const [sendOpen, setSendOpen] = useState(false)
  const [sendOrder, setSendOrder] = useState<OrderRow | null>(null)
  const [sendPhones, setSendPhones] = useState("")
  const [sending, setSending] = useState(false)
  const [sendErr, setSendErr] = useState<string | null>(null)

  // ✅ Toast
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

  async function load() {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch("/api/orders", { cache: "no-store" })

      if (res.status === 401) {
        const callbackUrl = encodeURIComponent("/pedidos")
        router.push(`/login?callbackUrl=${callbackUrl}`)
        return
      }

      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error((data as any)?.error || "No se pudieron cargar pedidos")

      setOrders(Array.isArray(data) ? (data as OrderRow[]) : [])
    } catch (e: any) {
      setError(e?.message || "Error cargando pedidos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase()
    if (!qq) return orders
    return orders.filter((o) => {
      const blob = `${o.folio} ${o.id} ${o.customerName} ${o.status}`.toLowerCase()
      return blob.includes(qq)
    })
  }, [orders, q])

  function openDeliver(o: OrderRow) {
    if (!o?.id) {
      showToast(
        { type: "error", title: "Pedido sin id", message: "Tu /api/orders no está regresando el campo id." },
        3500
      )
      return
    }

    setDeliverErr(null)
    setDeliverOrder(o)
    setDeliveredAt("")
    setDeliveredPlace("")
    setDeliverOpen(true)
  }

  async function confirmDeliver() {
    setDeliverErr(null)
    if (!deliverOrder) return

    if (!deliverOrder.id) {
      const msg = "Este pedido no tiene id. Revisa /api/orders (GET)."
      setDeliverErr(msg)
      showToast({ type: "error", title: "Pedido sin id", message: msg }, 3500)
      return
    }

    if (!deliveredAt) return setDeliverErr("Selecciona fecha y hora real de entrega.")
    if (!deliveredPlace.trim()) return setDeliverErr("Escribe dónde se entregó.")

    setDelivering(true)
    showToast({ type: "info", title: "Guardando entrega…", message: "Actualizando status y stock." }, 2200)

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(deliverOrder.id)}/deliver`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deliveredAt: new Date(deliveredAt).toISOString(),
          deliveredPlace: deliveredPlace.trim(),
        }),
      })

      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error((data as any)?.error || "No se pudo marcar como entregado")

      setDeliverOpen(false)
      setDeliverOrder(null)

      showToast(
        { type: "success", title: "Listo ✅", message: "Pedido marcado como ENTREGADO y stock actualizado." },
        2600
      )

      await load()
    } catch (e: any) {
      const msg = e?.message ?? "Error"
      setDeliverErr(msg)
      showToast({ type: "error", title: "No se pudo entregar", message: msg }, 3200)
    } finally {
      setDelivering(false)
    }
  }

  // ==========================
  // ✅ Envío WhatsApp (link PDF)
  // ==========================
  function openSend(o: OrderRow) {
    if (!o?.id) {
      showToast(
        { type: "error", title: "Pedido sin id", message: "Tu /api/orders no está regresando el campo id." },
        3500
      )
      return
    }
    setSendErr(null)
    setSendOrder(o)
    setSendPhones("")
    setSendOpen(true)
  }

  // ✅ Ruta relativa (safe en SSR)
  function getPdfPath(orderId: string) {
    return `/api/orders/${encodeURIComponent(orderId)}/pdf`
  }

  function getOriginSafe() {
    if (typeof window === "undefined") return ""
    return window.location.origin
  }

  function normalizePhone(v: string) {
    return v.replace(/[^\d]/g, "")
  }

  function parsePhones(input: string) {
    return input
      .split(/,|\n/g)
      .map((x) => normalizePhone(x.trim()))
      .filter(Boolean)
  }

  async function confirmSendWhatsApp() {
    setSendErr(null)
    if (!sendOrder) return
    if (!sendOrder.id) return setSendErr("Pedido sin id.")

    const phones = parsePhones(sendPhones)
    if (phones.length === 0) return setSendErr("Escribe al menos 1 número. Ej: 5217712345678")

    setSending(true)

    try {
      const origin = getOriginSafe()
      const pdfPath = getPdfPath(sendOrder.id)
      const pdfUrl = origin ? `${origin}${pdfPath}` : pdfPath

      const folio = sendOrder.folio || sendOrder.id
      const text = `Operadora Balles - Pedido ${folio}\nCliente: ${sendOrder.customerName}\nPDF: ${pdfUrl}`

      for (const phone of phones) {
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
        window.open(url, "_blank", "noopener,noreferrer")
      }

      showToast(
        {
          type: "success",
          title: "WhatsApp listo ✅",
          message: `Se abrieron ${phones.length} chat(s) con el link del PDF.`,
        },
        3200
      )

      setSendOpen(false)
      setSendOrder(null)
      setSendPhones("")
    } catch (e: any) {
      setSendErr(e?.message || "No se pudo preparar el envío")
      showToast({ type: "error", title: "Error al enviar", message: e?.message || "Error" }, 3200)
    } finally {
      setSending(false)
    }
  }

  const Toast = () => {
    if (!toast.open) return null
    const meta =
      toast.type === "success"
        ? { ring: "ring-emerald-300/40", bg: "bg-emerald-500/10", text: "text-emerald-800", dot: "bg-emerald-500" }
        : toast.type === "error"
        ? { ring: "ring-rose-300/40", bg: "bg-rose-500/10", text: "text-rose-800", dot: "bg-rose-500" }
        : { ring: "ring-sky-300/40", bg: "bg-sky-500/10", text: "text-sky-900", dot: "bg-sky-500" }

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
                {toast.message ? <div className="mt-1 text-xs text-slate-600">{toast.message}</div> : null}
              </div>
              <button
                onClick={() => setToast((t) => ({ ...t, open: false }))}
                className="shrink-0 rounded-xl px-2 py-1 text-xs font-semibold border border-white/70 bg-white/70 hover:bg-white transition"
              >
                Cerrar
              </button>
            </div>
            <div className={cn("mt-3 rounded-xl px-3 py-2 text-xs", meta.bg, meta.text)}>
              Tip: Si marca “stock insuficiente”, revisa inventario.
            </div>
          </div>
        </div>
      </div>
    )
  }

  const DeliverModal = () => {
    if (!deliverOpen || !deliverOrder) return null
    return (
      <div className="fixed inset-0 z-[998] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/30" onClick={() => (!delivering ? setDeliverOpen(false) : null)} />

        <div className="relative w-full max-w-lg rounded-2xl border border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_18px_60px_rgba(2,6,23,0.25)]">
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-base font-semibold text-slate-900">Confirmar entrega</div>
                <div className="mt-1 text-xs text-slate-600">
                  Pedido: <b>{deliverOrder.folio || deliverOrder.id}</b> • Cliente: <b>{deliverOrder.customerName}</b>
                </div>
                <div className="mt-1 text-xs text-slate-600">
                  Esto cambiará el status a <b>ENTREGADO</b> y descontará stock.
                </div>
              </div>

              <button
                onClick={() => setDeliverOpen(false)}
                disabled={delivering}
                className={cn(
                  "rounded-xl px-3 py-2 text-xs font-semibold",
                  "border border-white/70 bg-white/70 hover:bg-white transition",
                  delivering ? "opacity-60 cursor-not-allowed" : ""
                )}
              >
                Cerrar
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-sm font-semibold text-slate-800">Hora real de entrega</label>
                <input
                  type="datetime-local"
                  value={deliveredAt}
                  onChange={(e) => setDeliveredAt(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/70 bg-white/70 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-300/50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800">¿Dónde se entregó?</label>
                <input
                  value={deliveredPlace}
                  onChange={(e) => setDeliveredPlace(e.target.value)}
                  placeholder="Ej. Sucursal Centro / Domicilio / Recepción"
                  className="mt-2 w-full rounded-xl border border-white/70 bg-white/70 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-300/50"
                />
              </div>

              {deliverErr && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
                  {deliverErr}
                </div>
              )}

              <button
                disabled={delivering}
                onClick={confirmDeliver}
                className={cn(
                  "w-full rounded-xl px-4 py-3 text-sm font-semibold text-white",
                  "bg-gradient-to-r from-sky-600 via-indigo-600 to-rose-600 hover:brightness-95 transition",
                  delivering ? "opacity-60 cursor-not-allowed" : ""
                )}
              >
                {delivering ? "Guardando..." : "Confirmar entrega"}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const SendModal = () => {
    if (!sendOpen || !sendOrder) return null
    const pdfPath = sendOrder?.id ? getPdfPath(sendOrder.id) : ""

    return (
      <div className="fixed inset-0 z-[998] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/30" onClick={() => (!sending ? setSendOpen(false) : null)} />

        <div className="relative w-full max-w-lg rounded-2xl border border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_18px_60px_rgba(2,6,23,0.25)]">
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-base font-semibold text-slate-900">Enviar pedido por WhatsApp</div>
                <div className="mt-1 text-xs text-slate-600">
                  Pedido: <b>{sendOrder.folio || sendOrder.id}</b> • Cliente: <b>{sendOrder.customerName}</b>
                </div>
                <div className="mt-1 text-xs text-slate-600">
                  Se enviará el <b>link del PDF</b> del pedido.
                </div>
              </div>

              <button
                onClick={() => setSendOpen(false)}
                disabled={sending}
                className={cn(
                  "rounded-xl px-3 py-2 text-xs font-semibold",
                  "border border-white/70 bg-white/70 hover:bg-white transition",
                  sending ? "opacity-60 cursor-not-allowed" : ""
                )}
              >
                Cerrar
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-sm font-semibold text-slate-800">Número(s) destino</label>
                <textarea
                  value={sendPhones}
                  onChange={(e) => setSendPhones(e.target.value)}
                  placeholder={`Ej:\n5217712345678\n5215511122233\n\nO separados por coma:\n5217712345678, 5215511122233`}
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-white/70 bg-white/70 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-300/50"
                />
                <div className="mt-1 text-xs text-slate-500">
                  Tip: usa formato con LADA (MX: 52 + 1 + número). Ej: <b>5217712345678</b>
                </div>
              </div>

              <div className="rounded-xl border border-white/70 bg-white/70 p-3 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
                <span className="truncate">PDF del pedido:</span>
                {pdfPath ? (
                  <a
                    href={pdfPath}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-slate-900 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Abrir PDF →
                  </a>
                ) : (
                  <span className="text-slate-500">—</span>
                )}
              </div>

              {sendErr && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
                  {sendErr}
                </div>
              )}

              <button
                disabled={sending}
                onClick={confirmSendWhatsApp}
                className={cn(
                  "w-full rounded-xl px-4 py-3 text-sm font-semibold text-white",
                  "bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 hover:brightness-95 transition",
                  sending ? "opacity-60 cursor-not-allowed" : ""
                )}
              >
                {sending ? "Preparando..." : "Enviar por WhatsApp"}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="relative space-y-4 sm:space-y-6">
      <Toast />
      <DeliverModal />
      <SendModal />

      {/* Neon Clear background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-110px] h-[280px] w-[560px] -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-300/35 via-indigo-300/25 to-fuchsia-300/35 blur-3xl" />
        <div className="absolute right-[-120px] top-[35%] h-[260px] w-[260px] rounded-full bg-gradient-to-br from-emerald-300/20 to-sky-300/20 blur-3xl" />
        <div className="absolute left-[-120px] top-[60%] h-[260px] w-[260px] rounded-full bg-gradient-to-br from-amber-300/20 to-rose-300/20 blur-3xl" />
      </div>

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">Historial de pedidos</h1>
          <p className="mt-1 text-sm text-slate-600">Consulta pedidos recientes y entra al detalle.</p>
        </div>

        <button
          onClick={load}
          className={cn(
            "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold",
            "border border-white/70 bg-white/60 backdrop-blur-xl",
            "shadow-[0_10px_30px_rgba(2,6,23,0.08)] hover:bg-white/75 transition"
          )}
        >
          Recargar
        </button>
      </div>

      {/* Search */}
      <div className="rounded-2xl border border-white/60 bg-white/60 backdrop-blur-xl shadow-[0_10px_30px_rgba(2,6,23,0.08)]">
        <div className="p-3 sm:p-4">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar… (folio, cliente, estatus)"
            className={cn(
              "w-full rounded-xl px-3 py-2.5 text-sm",
              "border border-white/70 bg-white/70 text-slate-900 placeholder:text-slate-400",
              "outline-none focus:ring-2 focus:ring-cyan-300/50"
            )}
          />
        </div>
      </div>

      {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800">{error}</div>}

      {loading ? (
        <div className="rounded-2xl border border-white/60 bg-white/60 backdrop-blur-xl p-4 text-slate-600">
          Cargando…
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/60 bg-white/60 backdrop-blur-xl shadow-[0_10px_30px_rgba(2,6,23,0.08)] p-6 text-center">
          <div className="mx-auto mb-2 h-10 w-10 rounded-2xl bg-white/70 border border-white/70" />
          <div className="font-semibold text-slate-900">No hay pedidos</div>
          <div className="text-sm text-slate-600 mt-1">Cuando generes pedidos aparecerán aquí.</div>
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {filtered.map((o) => {
            const s = statusStyles(o.status)
            const canDeliver = o.status === "PENDIENTE" && !!o.id

            return (
              <Link
                key={o.id || `${o.folio}-${o.customerName}`}
                href={`/pedidos/${o.id}`}
                className={cn(
                  "group rounded-2xl border border-white/60 bg-white/60 backdrop-blur-xl",
                  "shadow-[0_10px_30px_rgba(2,6,23,0.08)] hover:shadow-[0_18px_60px_rgba(2,6,23,0.12)]",
                  "transition hover:-translate-y-[2px]"
                )}
              >
                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm sm:text-base font-semibold text-slate-900 truncate">{o.folio || o.id}</div>
                      <div className="mt-1 text-sm text-slate-600 truncate">{o.customerName}</div>

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span>Creado: {fmtDate(o.createdAt)}</span>
                        <span>Entrega: {fmtDate(o.deliveryAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className={cn("shrink-0 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold", s.pill)}>
                        <span className={cn("h-2 w-2 rounded-full", s.dot)} />
                        {s.label}
                      </div>

                      <button
                        disabled={!o.id}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          openSend(o)
                        }}
                        className={cn(
                          "inline-flex items-center justify-center rounded-xl px-3 py-2 text-xs font-semibold",
                          "border border-white/70 bg-white/70 hover:bg-white transition",
                          !o.id ? "opacity-50 cursor-not-allowed" : ""
                        )}
                      >
                        Enviar
                      </button>

                      {o.status === "PENDIENTE" && (
                        <button
                          disabled={!canDeliver}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            openDeliver(o)
                          }}
                          className={cn(
                            "inline-flex items-center justify-center rounded-xl px-3 py-2 text-xs font-semibold",
                            "border border-white/70 bg-white/70 hover:bg-white transition",
                            !canDeliver ? "opacity-50 cursor-not-allowed" : ""
                          )}
                        >
                          Entregar
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-white/70 bg-white/70 p-3 text-xs text-slate-600 flex items-center justify-between">
                    <span className="truncate">Ver detalle del pedido</span>
                    <span className="font-semibold text-slate-900 group-hover:underline">Abrir →</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}
