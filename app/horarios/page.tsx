"use client"

import { useEffect, useState } from "react"

type Slot = { id: string; date: string; window: string; enabled: boolean }

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
  const [window, setWindow] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function load() {
    const res = await fetch("/api/delivery-slots", { cache: "no-store" })
    const data = (await res.json()) as Slot[]
    setSlots(data)
  }

  useEffect(() => {
    load()
  }, [])

  async function createSlot() {
    setError(null)
    if (!date || !window.trim()) {
      setError("Falta fecha o ventana")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/delivery-slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, window }),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j?.error || "No se pudo crear")
      setDate("")
      setWindow("")
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
    if (!confirm("¿Eliminar horario?")) return
    await fetch(`/api/delivery-slots/${id}`, { method: "DELETE" })
    load()
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Horarios de entrega (ADMIN)</h1>

      <div className="rounded-2xl border bg-white/70 p-4 space-y-3">
        <div className="grid gap-3 md:grid-cols-3">
          <input
            className="rounded-xl border p-3"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <input
            className="rounded-xl border p-3"
            placeholder='Ventana (ej. "10:00 - 12:00")'
            value={window}
            onChange={(e) => setWindow(e.target.value)}
          />
          <button
            onClick={createSlot}
            disabled={loading}
            className="rounded-xl bg-black px-4 py-3 font-semibold text-white"
          >
            {loading ? "Creando..." : "Agregar"}
          </button>
        </div>

        {error && <div className="text-sm font-semibold text-red-600">{error}</div>}
      </div>

      <div className="space-y-3">
        {slots.map((s) => (
          <div key={s.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-white/70 p-4">
            <div>
              <div className="font-bold">{fmtDate(s.date)} — {s.window}</div>
              <div className="text-sm text-slate-600">{s.enabled ? "Habilitado" : "Deshabilitado"}</div>
            </div>

            <div className="flex items-center gap-2">
              <button className="rounded-xl border px-3 py-2" onClick={() => toggle(s.id, !s.enabled)}>
                {s.enabled ? "Deshabilitar" : "Habilitar"}
              </button>
              <button
                className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-rose-700"
                onClick={() => remove(s.id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
