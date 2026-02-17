"use client"

import { useEffect, useState } from "react"

type Slot = { id: string; date: string; window: string; enabled: boolean }

function cn(...s: Array<string | false | null | undefined>) {
  return s.filter(Boolean).join(" ")
}

const fmtDate = (iso: string) => {
  const d = new Date(iso)
  const dd = String(d.getDate()).padStart(2, "0")
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

export default function HorariosPage() {
  const [slots, setSlots] = useState<Slot[]>([])
  const [date, setDate] = useState("")
  const [timeWindow, setTimeWindow] = useState("") // ✅ renombrado para evitar confusión con window global
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingList, setLoadingList] = useState(false)

  async function load() {
    setLoadingList(true)
    try {
      const res = await fetch("/api/delivery-slots", { cache: "no-store" })
      const data = (await res.json()) as Slot[]
      setSlots(Array.isArray(data) ? data : [])
    } finally {
      setLoadingList(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function createSlot() {
    setError(null)
    if (!date || !timeWindow.trim()) {
      setError("Falta fecha o ventana")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/delivery-slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, window: timeWindow.trim() }),
      })

      const j = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error((j as any)?.error || "No se pudo crear")

      setDate("")
      setTimeWindow("")
      await load()
    } catch (e: any) {
      setError(e?.message ?? "Error")
    } finally {
      setLoading(false)
    }
  }

  async function toggle(id: string, enabled: boolean) {
    await fetch(`/api/delivery-slots/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled }),
    })
    load()
  }

  async function remove(id: string) {
    // ✅ confirm safe (no revienta build)
    const ok = typeof window !== "undefined" ? window.confirm("¿Eliminar horario?") : false
    if (!ok) return

    await fetch(`/api/delivery-slots/${id}`, { method: "DELETE" })
    load()
  }

  return (
    <section className="relative space-y-6">
      {/* Neon Clear bg */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-110px] h-[260px] w-[520px] -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-300/35 via-indigo-300/25 to-fuchsia-300/35 blur-3xl" />
        <div className="absolute right-[-120px] top-[35%] h-[240px] w-[240px] rounded-full bg-gradient-to-br from-emerald-300/20 to-sky-300/20 blur-3xl" />
        <div className="absolute left-[-120px] top-[60%] h-[240px] w-[240px] rounded-full bg-gradient-to-br from-amber-300/20 to-rose-300/20 blur-3xl" />
      </div>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Horarios de entrega (ADMIN)</h1>
        <p className="mt-1 text-sm text-slate-600">Crea ventanas de entrega y habilita/deshabilita.</p>
      </div>

      <div className="rounded-2xl border border-white/60 bg-white/60 backdrop-blur-xl shadow-[0_10px_30px_rgba(2,6,23,0.08)] p-4 space-y-3">
        <div className="grid gap-3 md:grid-cols-3">
          <input
            className="rounded-xl border border-white/70 bg-white/70 p-3 outline-none focus:ring-2 focus:ring-cyan-300/50"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <input
            className="rounded-xl border border-white/70 bg-white/70 p-3 outline-none focus:ring-2 focus:ring-cyan-300/50"
            placeholder='Ventana (ej. "10:00 - 12:00")'
            value={timeWindow}
            onChange={(e) => setTimeWindow(e.target.value)}
          />
          <button
            onClick={createSlot}
            disabled={loading}
            className={cn(
              "rounded-xl px-4 py-3 font-semibold text-white",
              "bg-gradient-to-r from-slate-900 to-slate-800 hover:brightness-110 transition",
              loading ? "opacity-60 cursor-not-allowed" : ""
            )}
          >
            {loading ? "Creando..." : "Agregar"}
          </button>
        </div>

        {error && <div className="text-sm font-semibold text-rose-700">{error}</div>}
      </div>

      <div className="space-y-3">
        {loadingList ? (
          <div className="rounded-2xl border border-white/60 bg-white/60 backdrop-blur-xl p-4 text-slate-600">
            Cargando horarios…
          </div>
        ) : slots.length === 0 ? (
          <div className="rounded-2xl border border-white/60 bg-white/60 backdrop-blur-xl p-6 text-center">
            <div className="font-semibold text-slate-900">No hay horarios</div>
            <div className="text-sm text-slate-600 mt-1">Agrega una ventana de entrega arriba.</div>
          </div>
        ) : (
          slots.map((s) => (
            <div
              key={s.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/60 bg-white/60 backdrop-blur-xl shadow-[0_10px_30px_rgba(2,6,23,0.08)] p-4"
            >
              <div>
                <div className="font-semibold text-slate-900">
                  {fmtDate(s.date)} — {s.window}
                </div>
                <div className="text-sm text-slate-600">{s.enabled ? "Habilitado" : "Deshabilitado"}</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="rounded-xl border border-white/70 bg-white/70 px-3 py-2 text-sm font-semibold hover:bg-white transition"
                  onClick={() => toggle(s.id, !s.enabled)}
                >
                  {s.enabled ? "Deshabilitar" : "Habilitar"}
                </button>

                <button
                  className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:brightness-95 transition"
                  onClick={() => remove(s.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
