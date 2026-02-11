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

/* =========================
   Modal incrustado
========================= */
function ConfirmModal({
  open,
  title = "Confirmar acción",
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  danger = false,
  onConfirm,
  onCancel,
  loading = false,
}: {
  open: boolean
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Fondo */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />

      {/* Modal */}
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="mt-2 text-sm text-slate-600">{message}</p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 ${
              danger ? "bg-rose-600 hover:bg-rose-700" : "bg-slate-900 hover:bg-black"
            }`}
          >
            {loading ? "Borrando..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminProductosPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [q, setQ] = useState("")

  // ✅ Modal state
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch("/api/products", { cache: "no-store" })
      const data = await res.json().catch(() => ([] as Product[]))
      if (!res.ok) {
        alert((data as any)?.error || "No se pudo cargar productos")
        setProducts([])
        return
      }
      setProducts(data as Product[])
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
    const res = await fetch(`/api/products/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock }),
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      alert((data as any)?.error || "No se pudo actualizar stock")
      return
    }

    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, stock } : p)))
  }

  // ✅ Ya no usamos confirm() del navegador
  function askRemove(id: string) {
    setConfirmId(id)
  }

  async function removeConfirmed() {
    if (!confirmId) return
    setDeleting(true)

    try {
      const res = await fetch(`/api/products/${encodeURIComponent(confirmId)}`, {
        method: "DELETE",
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        alert((data as any)?.error || "No se pudo borrar")
        return
      }

      setProducts((prev) => prev.filter((p) => p.id !== confirmId))
      setConfirmId(null)
    } finally {
      setDeleting(false)
    }
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
                      href={`/admin/productos/${encodeURIComponent(p.id)}/editar`}
                      className="flex-1 rounded-xl border px-3 py-2 text-center text-xs font-semibold hover:bg-slate-50"
                    >
                      Editar
                    </Link>

                    <button
                      onClick={() => askRemove(p.id)}
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
                      href={`/admin/productos/${encodeURIComponent(p.id)}/editar`}
                      className="rounded-xl border px-3 py-2 text-xs font-semibold hover:bg-slate-50"
                    >
                      Editar
                    </Link>

                    <button
                      onClick={() => askRemove(p.id)}
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

      {/* ✅ Modal bonito */}
      <ConfirmModal
        open={!!confirmId}
        title="Eliminar producto"
        message="Esta acción no se puede deshacer. ¿Seguro que deseas borrar este producto?"
        confirmText="Sí, borrar"
        cancelText="Cancelar"
        danger
        loading={deleting}
        onCancel={() => setConfirmId(null)}
        onConfirm={removeConfirmed}
      />
    </section>
  )
}
