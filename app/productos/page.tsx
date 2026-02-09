
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { headers } from "next/headers"
import ProductCardServer from "./ProductCardServer"

type ProductRow = {
  id: string
  name: string
  price: number
  category: string
  image: string
  description: string
  stock: number
  createdAt?: string
}

function uniq(arr: string[]) {
  return Array.from(new Set(arr.filter(Boolean))).sort((a, b) => a.localeCompare(b))
}

export default async function ProductosPage() {
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host")
  const proto = h.get("x-forwarded-proto") ?? "http"
  const base = `${proto}://${host}`

  const res = await fetch(`${base}/api/products`, { cache: "no-store" })
  const data = await res.json().catch(() => [])
  const products: ProductRow[] = Array.isArray(data) ? data : []

  const categories = ["Todas", ...uniq(products.map((p) => p.category || ""))]

  return (
    <section className="space-y-6">
      {/* HERO / PANEL */}
      <div className="relative overflow-hidden rounded-[28px] border bg-white shadow-sm">
        {/* fondo decorativo suave */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-sky-100 blur-3xl" />
          <div className="absolute -bottom-28 -right-28 h-72 w-72 rounded-full bg-indigo-100 blur-3xl" />
        </div>

        <div className="relative p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Productos
              </h1>
              <p className="mt-1 text-sm text-slate-600">Catálogo general</p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full border bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700">
                  {products.length} producto{products.length === 1 ? "" : "s"}
                </span>
                <span className="inline-flex items-center rounded-full border bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700">
                  Actualización en vivo
                </span>
              </div>
            </div>

            {/* Recargar */}
            <a
              href="/productos"
              className="inline-flex items-center justify-center rounded-2xl border bg-white/80 px-5 py-2.5 text-sm font-semibold shadow-sm hover:bg-white"
            >
              Recargar
            </a>
          </div>

          {/* CONTROLES (solo UI, sin JS para no romper estabilidad) */}
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-12">
            {/* Buscar */}
            <div className="sm:col-span-6">
              <div className="flex items-center gap-2 rounded-2xl border bg-white/85 px-3 py-2 shadow-sm">
                <span className="text-slate-400">🔎</span>
                <input
                  placeholder="Buscar por nombre, categoría o ID…"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                (Próximo: filtro real con query params)
              </div>
            </div>

            {/* Categoría */}
            <div className="sm:col-span-4">
              <select className="w-full rounded-2xl border bg-white/85 px-3 py-2 text-sm shadow-sm">
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Stock */}
            <div className="sm:col-span-2">
              <button
                type="button"
                className="w-full rounded-2xl border bg-white/85 px-3 py-2 text-sm font-semibold shadow-sm"
              >
                Todos
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="rounded-[28px] border bg-white/70 p-3 shadow-sm backdrop-blur-sm sm:p-4">
        {products.length === 0 ? (
          <div className="rounded-2xl border bg-white p-6 text-sm text-slate-600">
            No hay productos.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCardServer
                key={p.id}
                id={p.id}
                name={p.name}
                category={p.category}
                image={p.image}
                description={p.description}
                price={p.price}
                stock={p.stock}
                href={`/producto/${p.id}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
