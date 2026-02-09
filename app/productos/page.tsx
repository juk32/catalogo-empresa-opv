export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { headers } from "next/headers"
import ProductCard3D from "./ProductCard3D"

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
  // Construir base URL desde el request actual (sirve en Vercel y local)
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host")
  const proto = h.get("x-forwarded-proto") ?? "http"
  const base = `${proto}://${host}`

  const url = `${base}/api/products`

  const res = await fetch(url, { cache: "no-store" })
  const data = await res.json().catch(() => [])

  const products: ProductRow[] = Array.isArray(data) ? data : []
  const categories = ["Todas", ...uniq(products.map((p) => p.category || ""))]

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border bg-white/70 backdrop-blur shadow-sm overflow-hidden">
        <div className="px-4 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Productos</h1>
              <p className="mt-1 text-sm text-slate-600">Catálogo general</p>
              <div className="mt-3 text-xs text-slate-500">
                {products.length} producto{products.length === 1 ? "" : "s"}
              </div>
            </div>

            <a
              href="/productos"
              className="rounded-2xl border bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 text-center"
            >
              Recargar
            </a>
          </div>

          {/* UI filtros (solo visual) */}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-12">
            <div className="sm:col-span-6">
              <div className="flex items-center gap-2 rounded-2xl border bg-white px-3 py-2">
                <span className="text-slate-400 text-sm">🔎</span>
                <input
                  placeholder="Buscar por nombre, categoría o ID…"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <select className="w-full rounded-2xl border bg-white px-3 py-2 text-sm">
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <button
                type="button"
                className="w-full rounded-2xl border bg-white px-3 py-2 text-sm font-semibold"
              >
                Todos
              </button>
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>

      <div className="rounded-[28px] border bg-white/70 p-3 shadow-sm backdrop-blur sm:p-4">
        {products.length === 0 ? (
          <div className="rounded-2xl border bg-white p-6 text-sm text-slate-600">
            No hay productos.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {products.map((p) => (
              <ProductCard3D
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
