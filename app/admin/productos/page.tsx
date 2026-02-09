"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

type Product = {
  id: string
  name: string
  price: number
  category: string
  image: string
  description: string
  details: any
  rating: number
  stock: number
  createdAt?: string
}

function formatMoney(n: number) {
  return n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function AdminProductosPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [q, setQ] = useState("")

  async function load() {
    setLoading(true)
    try {
      const res = await fetch("/api/products", { cache: "no-store" })
      const data = await res.json()
      if (!res.ok) {
        alert(data?.error || "No se pudo cargar productos")
        setProducts([])
        return
      }
      setProducts(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return products
    return products.filter((p) =>
      [p.id, p.name, p.category].some((x) => (x || "").toLowerCase().includes(s))
    )
  }, [products, q])

  async function updateStock(id: string, stock: number) {
    const res = await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      alert(data?.error || "No se pudo actualizar stock")
      return
    }
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, stock } : p)))
  }

  async function remove(id: string) {
    if (!confirm("¿Seguro que quieres borrar este producto?")) return
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      alert(data?.error || "No se pudo borrar")
      return
    }
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <section className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Productos (Admin)</h1>
          <p className="mt-1 text-slate-600">Gestiona altas, stock, edición y bajas.</p>
        </div>

        <Link
          href="/agregar-productos"
          className="rounded-2xl bg-black px-4 py-2 text-sm font-semibold text-white"
        >
          + Nuevo producto
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por ID, nombre o categoría..."
          className="w-full rounded-2xl border bg-white p-3 sm:max-w-md"
        />

        <button
          onClick={() => {
            load()
            router.refresh()
          }}
          className="rounded-2xl border bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
        >
          Recargar
        </button>
      </div>

      {loading ? (
        <div className="rounded-2xl border bg-white p-6">Cargando...</div>
      ) : (
        <>
          {/* =========================
              MÓVIL (Cards)
          ========================= */}
          <div className="md:hidden space-y-3">
            {filtered.length === 0 ? (
              <div className="rounded-2xl border bg-white p-6 text-sm text-slate-600">
                No hay productos.
              </div>
            ) : (
              filtered.map((p) => (
                <div key={p.id} className="rounded-2xl border bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold leading-tight">{p.name}</div>
                      <div className="mt-1 text-xs text-slate-500 break-all">{p.id}</div>
                    </div>

                    <div className="shrink-0 text-right">
                      <div className="text-xs text-slate-500">Precio</div>
                      <div className="font-semibold">${formatMoney(p.price)}</div>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-xs text-slate-500">Categoría</div>
                      <div className="font-medium">{p.category}</div>
                    </div>

                    <div>
                      <div className="text-xs text-slate-500">Stock</div>
                      <input
                        type="number"
                        className="mt-1 w-full rounded-xl border p-2"
                        defaultValue={p.stock}
                        onBlur={(e) => updateStock(p.id, Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Link
                      href={`/admin/productos/${p.id}/editar`}
                      className="flex-1 rounded-xl border px-3 py-2 text-center text-xs font-semibold hover:bg-slate-50"
                    >
                      Editar
                    </Link>

                    <button
                      onClick={() => remove(p.id)}
                      className="flex-1 rounded-xl border px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                    >
                      Borrar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* =========================
              DESKTOP (Tabla)
          ========================= */}
          <div className="hidden md:block overflow-hidden rounded-2xl border bg-white">
            <div className="grid grid-cols-12 gap-2 border-b bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">
              <div className="col-span-3">Producto</div>
              <div className="col-span-2">Categoría</div>
              <div className="col-span-2">Precio</div>
              <div className="col-span-2">Stock</div>
              <div className="col-span-3 text-right">Acciones</div>
            </div>

            {filtered.length === 0 ? (
              <div className="p-6 text-sm text-slate-600">No hay productos.</div>
            ) : (
              filtered.map((p) => (
                <div
                  key={p.id}
                  className="grid grid-cols-12 gap-2 px-4 py-3 text-sm border-b last:border-b-0"
                >
                  <div className="col-span-3">
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-xs text-slate-500">{p.id}</div>
                  </div>

                  <div className="col-span-2 text-slate-700">{p.category}</div>

                  <div className="col-span-2 font-semibold">${formatMoney(p.price)}</div>

                  <div className="col-span-2">
                    <input
                      type="number"
                      className="w-28 rounded-xl border p-2"
                      defaultValue={p.stock}
                      onBlur={(e) => updateStock(p.id, Number(e.target.value))}
                    />
                  </div>

                  <div className="col-span-3 flex justify-end gap-2">
                    <Link
                      href={`/admin/productos/${p.id}/editar`}
                      className="rounded-xl border px-3 py-2 text-xs font-semibold hover:bg-slate-50"
                    >
                      Editar
                    </Link>

                    <button
                      onClick={() => remove(p.id)}
                      className="rounded-xl border px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                    >
                      Borrar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </section>
  )
}
