"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

type OrderStatus = "PENDIENTE" | "ENTREGADO"

type OrderRow = {
  id: string
  folio: string
  customerName: string
  status: OrderStatus
  createdAt?: string
  deliveryAt?: string | null
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

function statusPill(status: OrderStatus) {
  return status === "ENTREGADO"
    ? "bg-emerald-500/10 text-emerald-800 border-emerald-200"
    : "bg-amber-500/10 text-amber-900 border-amber-200"
}

function toLocalDatetime(iso: string) {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ""
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}`
}

export default function PedidosClient() {
  const router = useRouter()
  const sp = useSearchParams()

  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [q, setQ] = useState("")

  // modal entrega
  const [deliverOpen, setDeliverOpen] = useState(false)
  const [deliverOrder, setDeliverOrder] = useState<OrderRow | null>(null)
  const [deliverAt, setDeliverAt] = useState("") // datetime-local
  const [deliverPlace, setDeliverPlace] = useState("")
  const [deliverSaving, setDeliverSaving] = useState(false)

  // evita loops / reabrir
  const openedOnceRef = useRef<string | null>(null)

  async function fetchOrders() {
    setLoading(true)
    setErr(null)
    try {
      const res = await fetch("/api/orders", { cache: "no-store" })
      const data = await res.json().catch(() => null)

      const list = (Array.isArray(data) ? data : data?.orders) as OrderRow[] | undefined
      setOrders(list ?? [])
    } catch (e: any) {
      setErr(e?.message ?? "No se pudieron cargar los pedidos")
    } finally {
      setLoading(false)
    }
  }

  // ✅ carga inicial
  useEffect(() => {
    fetchOrders()
  }, [])

  function openDeliver(order: OrderRow) {
    setDeliverOrder(order)
    setDeliverAt(order.deliveredAt ? toLocalDatetime(order.deliveredAt) : "")
    setDeliverPlace(order.deliveredPlace ?? "")
    setDeliverOpen(true)
  }

  function closeDeliver() {
    setDeliverOpen(false)
    setDeliverOrder(null)
    setDeliverAt("")
    setDeliverPlace("")
  }

  // ✅ helper: trae pedido por id (tu endpoint devuelve el order directo)
  async function fetchOrderById(id: string): Promise<OrderRow | null> {
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(id)}`, { cache: "no-store" })
      const data = await res.json().catch(() => null)
      if (!res.ok) return null
      return (data as OrderRow) ?? null
    } catch {
      return null
    }
  }

  /**
   * ✅ AUTO ABRIR MODAL POR ?deliver=ID (estable)
   * - No depende de que el pedido esté en la lista
   * - Evita loops con openedOnceRef
   * - Limpia el query sin “brincos”
   */
  useEffect(() => {
    const idRaw = sp.get("deliver")
    const id = (idRaw ?? "").trim()
    if (!id) return

    // evita reabrir si ya lo procesamos
    if (openedOnceRef.current === id) return
    openedOnceRef.current = id

    let cancelled = false

    async function run() {
      // 1) intenta con lo ya cargado
      const found = orders.find((o) => o.id === id)
      if (found) {
        openDeliver(found)
      } else {
        // 2) fallback: pedirlo al server
        const order = await fetchOrderById(id)
        if (cancelled || !order) return

        // opcional: NO lo metas a la lista (para que “no se mueva” el orden visual)
        // si sí lo quieres mostrar arriba, descomenta:
        // setOrders((prev) => (prev.some((x) => x.id === order.id) ? prev : [order, ...prev]))

        openDeliver(order)
      }

      // 3) limpiar deliver del URL para que no se reabra en refresh
      const url = new URL(window.location.href)
      url.searchParams.delete("deliver")
      router.replace(url.pathname + (url.search ? url.search : ""), { scroll: false })
    }

    run()

    return () => {
      cancelled = true
    }
  }, [sp, orders, router]) // ✅ dependemos de orders para el "found"; si no, fallback API igual abre

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return orders
    return orders.filter((o) => `${o.folio} ${o.customerName} ${o.status}`.toLowerCase().includes(s))
  }, [orders, q])

  async function confirmDeliver() {
    if (!deliverOrder) return
    setDeliverSaving(true)
    setErr(null)

    try {
      const body = {
        deliveredAt: deliverAt ? new Date(deliverAt).toISOString() : new Date().toISOString(),
        deliveredPlace: deliverPlace?.trim() || null,
      }

      const res = await fetch(`/api/orders/${encodeURIComponent(deliverOrder.id)}/deliver`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error((data as any)?.error || "No se pudo confirmar entrega")

      await fetchOrders()
      closeDeliver()
    } catch (e: any) {
      setErr(e?.message ?? "Error confirmando entrega")
    } finally {
      setDeliverSaving(false)
    }
  }

  return (
    <section className="relative space-y-5 sm:space-y-7">
      {/* fondo */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-120px] h-[320px] w-[720px] -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-300/35 via-indigo-300/25 to-fuchsia-300/35 blur-3xl" />
        <div className="absolute right-[-140px] top-[35%] h-[280px] w-[280px] rounded-full bg-gradient-to-br from-emerald-300/18 to-sky-300/18 blur-3xl" />
        <div className="absolute left-[-140px] top-[60%] h-[280px] w-[280px] rounded-full bg-gradient-to-br from-amber-300/16 to-rose-300/16 blur-3xl" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
            Historial de pedidos
          </h1>
          <p className="mt-1 text-sm text-slate-600">Consulta pedidos recientes y entra al detalle.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={fetchOrders}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-semibold",
              "border border-white/70 bg-white/60 backdrop-blur-xl",
              "shadow-[0_10px_30px_rgba(2,6,23,0.08)] hover:bg-white/75 transition"
            )}
          >
            Recargar
          </button>

          <Link
            href="/generar-pedido"
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-semibold text-white",
              "shadow-[0_18px_60px_rgba(2,6,23,0.22)]",
              "bg-gradient-to-r from-sky-600 via-indigo-600 to-rose-600 hover:brightness-95 transition"
            )}
          >
            Nuevo pedido
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-white/60 bg-white/60 backdrop-blur-xl shadow-[0_10px_30px_rgba(2,6,23,0.08)] p-4 sm:p-5">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar... (folio, cliente, estatus)"
          className={cn(
            "w-full rounded-xl px-3 py-2.5 text-sm",
            "border border-white/70 bg-white/70 text-slate-900 placeholder:text-slate-400",
            "outline-none focus:ring-2 focus:ring-cyan-300/50"
          )}
        />
      </div>

      {err && <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800">{err}</div>}

      <div className="grid gap-3">
        {loading ? (
          <div className="rounded-2xl border border-white/60 bg-white/60 backdrop-blur-xl shadow p-6 text-slate-600">
            Cargando…
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-white/60 bg-white/60 backdrop-blur-xl shadow p-6 text-slate-600">
            No hay pedidos.
          </div>
        ) : (
          filtered.map((o) => (
            <div
              key={o.id}
              className="rounded-2xl border border-white/60 bg-white/60 backdrop-blur-xl shadow-[0_10px_30px_rgba(2,6,23,0.08)] hover:bg-white/70 transition"
            >
              <div className="p-4 sm:p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-black text-slate-900 tracking-tight">{o.folio}</div>
                    <span className={cn("text-xs px-2 py-1 rounded-full border", statusPill(o.status))}>
                      {o.status}
                    </span>
                  </div>
                  <div className="mt-1 text-slate-900 font-semibold">{o.customerName}</div>
                  <div className="mt-1 text-xs text-slate-600">
                    Creado: {fmtDate(o.createdAt)} • Entrega: {fmtDate(o.deliveryAt)}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/api/orders/${encodeURIComponent(o.id)}/pdf`}
                    target="_blank"
                    className={cn(
                      "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold",
                      "border border-white/70 bg-white/70 hover:bg-white transition"
                    )}
                  >
                    Ver PDF
                  </Link>

                  <button
                    onClick={() => openDeliver(o)}
                    className={cn(
                      "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white",
                      "shadow-[0_18px_60px_rgba(2,6,23,0.18)]",
                      "bg-gradient-to-r from-sky-600 via-indigo-600 to-rose-600 hover:brightness-95 transition"
                    )}
                  >
                    Entregar
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {deliverOpen && deliverOrder ? (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-[2px]" onClick={closeDeliver} />

          <div className="relative w-[92vw] max-w-2xl rounded-3xl border border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_18px_60px_rgba(2,6,23,0.25)]">
            <div className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-black text-slate-900">Confirmar entrega</div>
                  <div className="mt-1 text-sm text-slate-700">
                    Pedido: <span className="font-semibold">{deliverOrder.folio}</span> • Cliente:{" "}
                    <span className="font-semibold">{deliverOrder.customerName}</span>
                  </div>
                  <div className="mt-1 text-xs text-slate-600">
                    Esto cambiará el status a <b>ENTREGADO</b> y descontará stock.
                  </div>
                </div>

                <button
                  onClick={closeDeliver}
                  className={cn(
                    "rounded-xl px-4 py-2 text-sm font-semibold",
                    "border border-white/70 bg-white/70 hover:bg-white transition"
                  )}
                >
                  Cerrar
                </button>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-800">Hora real de entrega</label>
                  <input
                    type="datetime-local"
                    value={deliverAt}
                    onChange={(e) => setDeliverAt(e.target.value)}
                    className={cn(
                      "mt-2 w-full rounded-xl px-3 py-2.5 text-sm",
                      "border border-white/70 bg-white/70 text-slate-900",
                      "outline-none focus:ring-2 focus:ring-cyan-300/50"
                    )}
                  />
                  <div className="mt-1 text-xs text-slate-600">Si lo dejas vacío, se toma la hora actual.</div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800">¿Dónde se entregó?</label>
                  <input
                    value={deliverPlace}
                    onChange={(e) => setDeliverPlace(e.target.value)}
                    placeholder="Ej. Sucursal Centro / Domicilio / Bodega"
                    className={cn(
                      "mt-2 w-full rounded-xl px-3 py-2.5 text-sm",
                      "border border-white/70 bg-white/70 text-slate-900 placeholder:text-slate-400",
                      "outline-none focus:ring-2 focus:ring-cyan-300/50"
                    )}
                  />
                </div>

                <button
                  onClick={confirmDeliver}
                  disabled={deliverSaving}
                  className={cn(
                    "w-full rounded-xl px-6 py-3 text-sm font-semibold text-white",
                    "shadow-[0_18px_60px_rgba(2,6,23,0.22)]",
                    "bg-gradient-to-r from-sky-600 via-indigo-600 to-rose-600 hover:brightness-95 transition",
                    deliverSaving ? "opacity-60 cursor-not-allowed" : ""
                  )}
                >
                  {deliverSaving ? "Confirmando..." : "Confirmar entrega"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}