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

export default async function ProductosPage() {
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host")
  const proto = h.get("x-forwarded-proto") ?? "http"
  const base = `${proto}://${host}`

  const res = await fetch(`${base}/api/products`, { cache: "no-store" })
  const data = await res.json().catch(() => [])

  const products: ProductRow[] = Array.isArray(data) ? data : []

  return (
    <section className="space-y-6">
      {/* Encabezado SIN blur/sticky para evitar parpadeo en móvil emulado */}
      <div className="rounded-3xl border bg-white shadow-sm overflow-hidden">
        <div className="px-4 py-5 sm:px-6 sm:py-6">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Productos</h1>
              <p className="mt-1 text-sm text-slate-600">Catálogo general</p>
              <div className="mt-2 text-xs text-slate-500">
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
        </div>
      </div>

      {/* DEBUG visible (temporal) para confirmar que SI trae productos */}
      <div className="text-[11px] text-slate-500">
        debug: count={products.length} first={products[0]?.id || "none"}
      </div>

      {/* Grid */}
      <div className="rounded-[28px] border bg-white p-3 sm:p-4">
        {products.length === 0 ? (
          <div className="rounded-2xl border bg-white p-6 text-sm text-slate-600">
            No hay productos.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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
