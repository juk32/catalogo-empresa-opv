"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"

type Item = { productId: string; qty: number; name?: string }

export default function EditPedidoPage() {
  const { id } = useParams<{ id: string }>()
  const orderId = Number(id)

  const [cliente, setCliente] = useState("")
  const [items, setItems] = useState<Item[]>([])
  const [note, setNote] = useState("")

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/orders")
      if (!res.ok) throw new Error(await res.text())
      const all = await res.json()
      const found = all.find((x: any) => x.id === orderId)
      if (!found) throw new Error("Pedido no encontrado")

      setCliente(found.cliente)
      setItems(found.items.map((it: any) => ({ productId: it.productId, qty: it.qty, name: it.name })))
    } catch (e: any) {
      setError(e?.message ?? "Error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [orderId])

  const canSave = useMemo(() => cliente.trim() && items.length > 0 && items.every((x) => x.qty > 0), [cliente, items])

  async function save() {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cliente, items: items.map(({ productId, qty }) => ({ productId, qty })), note }),
      })
      if (!res.ok) throw new Error(await res.text())
      window.location.href = "/pedidos"
    } catch (e: any) {
      setError(e?.message ?? "Error al guardar")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-slate-600">Cargando...</div>

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Editar pedido #{orderId}</h1>
        <Link className="rounded-2xl border px-4 py-2 font-semibold" href="/pedidos">Volver</Link>
      </div>

      {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800">{error}</div>}

      <div className="rounded-2xl border bg-white/70 p-4 space-y-2">
        <div className="font-semibold">Cliente</div>
        <input className="w-full rounded-xl border px-4 py-3" value={cliente} onChange={(e) => setCliente(e.target.value)} />
      </div>

      <div className="rounded-2xl border bg-white/70 p-4 space-y-3">
        <div className="font-semibold">Productos</div>
        {items.map((it, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className="flex-1">
              <div className="font-semibold">{it.name ?? it.productId}</div>
              <div className="text-xs text-slate-600">{it.productId}</div>
            </div>
            <input
              type="number"
              min={1}
              className="w-24 rounded-xl border px-3 py-2"
              value={it.qty}
              onChange={(e) => {
                const v = Number(e.target.value)
                setItems((prev) => prev.map((x, i) => (i === idx ? { ...x, qty: v } : x)))
              }}
            />
            <button
              className="rounded-xl border px-3 py-2 font-semibold text-rose-700"
              onClick={() => setItems((prev) => prev.filter((_, i) => i !== idx))}
            >
              Quitar
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border bg-white/70 p-4 space-y-2">
        <div className="font-semibold">Nota (opcional)</div>
        <input className="w-full rounded-xl border px-4 py-3" value={note} onChange={(e) => setNote(e.target.value)} />
      </div>

      <button
        disabled={!canSave || saving}
        onClick={save}
        className={[
          "w-full rounded-2xl px-6 py-3 font-semibold text-white",
          "bg-gradient-to-r from-sky-600 to-rose-600 hover:brightness-95",
          (!canSave || saving) ? "opacity-60" : "",
        ].join(" ")}
      >
        {saving ? "Guardando..." : "Guardar cambios"}
      </button>
    </section>
  )
}
