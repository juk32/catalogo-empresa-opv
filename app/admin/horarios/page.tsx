"use client"

import { useEffect, useState } from "react"

type DeliverySlot = {
  id: string
  startAt: string
  endAt: string
  capacity: number
  active: boolean
}

function fmt(s: DeliverySlot) {
  const start = new Date(s.startAt)
  const end = new Date(s.endAt)
  const d = start.toLocaleDateString("es-MX", { year: "numeric", month: "2-digit", day: "2-digit" })
  const t1 = start.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })
  const t2 = end.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })
  return `${d} • ${t1} - ${t2}`
}

export default function HorariosAdminPage() {
  const [slots, setSlots] = useState<DeliverySlot[]>([])
  const [date, setDate] = useState("")       // yyyy-mm-dd
  const [start, setStart] = useState("09:00")
  const [end, setEnd] = useState("10:00")
  const [capacity, setCapacity] = useState(999)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function load() {
    const r = await fetch("/api/delivery-slots")
    const data = await r.json().catch(() => [])
    setSlots(Array.isArray(data) ? data : [])
  }

  useEffect(() => { load() }, [])

  async function createSlot() {
    setError(null)
    if (!date) return setError("Elige fecha")

    const startAt = new Date(`${date}T${start}:00`)
    const endAt = new Date(`${date}T${end}:00`)

    setLoading(true)
    try {
      const r = await fetch("/api/delivery-slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startAt: startAt.toISOString(), endAt: endAt.toISOString(), capacity }),
      })
      const data = await r.json().catch(() => null)
      if (!r.ok) throw new Error(data?.error || "No se pudo crear")

      await load()
      setDate("")
    } catch (e: any) {
      setError(e?.message || "Error")
    } finally {
      setLoading(false)
    }
  }

  async function remove(id: string) {
    if (!confirm("¿Eliminar horario?")) return
    const r = await fetch(`/api/delivery-slots/${id}`, { method: "DELETE" })
    const data = await r.json().catch(() => null)
    if (!r.ok) alert(data?.error || "No se pudo eliminar")
    await load()
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Horarios de entrega (ADMIN)</h1>

      <div className="rounded-2xl border bg-white/70 p-4 space-y-3">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <div>
            <label className="text-sm font-semibold">Fecha</label>
            <input className="mt-1 w-full rounded-xl border p-3" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-semibold">Inicio</label>
            <input className="mt-1 w-full rounded-xl border p-3" type="time" value={start} onChange={(e) => setStart(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-semibold">Fin</label>
            <input className="mt-1 w-full rounded-xl border p-3" type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-semibold">Capacidad</label>
            <input className="mt-1 w-full rounded-xl border p-3" type="number" value={capacity} onChange={(e) => setCapacity(Number(e.target.value || 0))} />
          </div>
        </div>

        {error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-800">{error}</div>}

        <button
          onClick={createSlot}
          disabled={loading}
          className="rounded-2xl bg-black px-5 py-3 font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Creando..." : "Crear horario"}
        </button>
      </div>

      <div className="space-y-3">
        {slots.length === 0 ? (
          <div className="text-slate-600">No hay horarios.</div>
        ) : (
          slots.map((s) => (
            <div key={s.id} className="flex items-center justify-between gap-3 rounded-2xl border bg-white/70 p-4">
              <div>
                <div className="font-semibold">{fmt(s)}</div>
                <div className="text-sm text-slate-600">Capacidad: {s.capacity}</div>
              </div>
              <button
                className="rounded-xl border px-4 py-2 font-semibold text-rose-700 hover:bg-rose-50"
                onClick={() => remove(s.id)}
              >
                Eliminar
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
