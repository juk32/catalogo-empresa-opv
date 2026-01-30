"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { getCart, type CartItem, clearCart } from "@/lib/cart"


function money(n: number) {
  return n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function fechaHoy() {
  // Si quieres dd/mm/aaaa lo cambiamos
  return new Date().toISOString().slice(0, 10)
}

function nuevoFolio() {
  return `PED-${Date.now()}`
}

export default function GenerarPedidoPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [cliente, setCliente] = useState("") // 
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setItems(getCart())
  }, [])

  const total = useMemo(
    () => items.reduce((acc, x) => acc + x.price * x.qty, 0),
    [items]
  )

  async function onGeneratePdf() {
    setError(null)

    if (items.length === 0) {
      setError("Tu carrito está vacío.")
      return
    }

    const solicitadoPor = cliente.trim()
    if (!solicitadoPor) {
      setError("Escribe el nombre del cliente.")
      return
    }

    setLoading(true)
    try {
      const body = {
        folio: nuevoFolio(),
        fecha: fechaHoy(),
        solicitadoPor, // ✅ IMPORTANTE
        items: items.map((x) => ({
          clave: x.id, // ✅ IMPORTANTE
          descripcion: x.name, // ✅ IMPORTANTE
          unidad: "PZ", // puedes cambiarlo si tienes otra unidad
          cantidad: x.qty, // ✅ IMPORTANTE
          costoUnitario: x.price, // ✅ IMPORTANTE
        })),
      }

      const res = await fetch("/api/pedido/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const t = await res.text()
        throw new Error(t || "No se pudo generar el PDF")
      }

      // Recibir PDF y descargar
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `pedido-${body.folio}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (e: any) {
      setError(e?.message ?? "Error al generar PDF")
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Generar pedido</h1>
        <p className="text-slate-600">No hay productos en el carrito.</p>
        <Link className="inline-flex rounded-2xl bg-sky-600 px-5 py-3 font-semibold text-white" href="/productos">
          Ir a productos
        </Link>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Generar pedido</h1>
        <Link className="rounded-2xl border px-4 py-2 font-semibold" href="/carrito">
          Volver al carrito
        </Link>
      </div>

      {/* ✅ NUEVO: Cliente */}
      <div className="rounded-2xl border bg-white/70 p-4">
        <label className="block text-sm font-semibold text-slate-700">
          Cliente / Solicitante
        </label>
        <input
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
          placeholder="Ej. Juan Pérez"
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-sky-300"
        />
      </div>

      <div className="space-y-3">
        {items.map((x) => (
          <div key={x.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-white/70 p-4">
            <div>
              <div className="font-bold">{x.name}</div>
              <div className="text-sm text-slate-600">{x.id}</div>
            </div>
            <div className="text-sm">
              {x.qty} × ${money(x.price)}
            </div>
            <div className="font-bold">Subtotal: ${money(x.qty * x.price)}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-2xl border bg-white/70 p-4">
        <div className="text-lg font-bold">Total</div>
        <div className="text-xl font-black">${money(total)}</div>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
          {error}
        </div>
      )}

      <button
        onClick={onGeneratePdf}
        disabled={loading}
        className={[
          "w-full rounded-2xl px-6 py-3 font-semibold text-white",
          "bg-gradient-to-r from-sky-600 to-rose-600 hover:brightness-95",
          loading ? "opacity-60" : "",
        ].join(" ")}
      >
        {loading ? "Generando PDF..." : "Generar PDF"}
      </button>
    </section>
  )
}
