import Link from "next/link"
import { prisma } from "@/lib/prisma"
import ProductActions from "./ProductActions"
import ZoomImage from "./ZoomImage"

export const runtime = "nodejs"

function formatMoney(n: number) {
  return n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

type Ctx = { params: Promise<{ id: string }> }

function clampStars(n: number) {
  const v = Math.round(Number(n) || 0)
  return Math.max(0, Math.min(5, v))
}

export default async function ProductoDetallePage({ params }: Ctx) {
  const { id: rawId } = await params
  const id = decodeURIComponent(rawId)

  const product = await prisma.product.findUnique({ where: { id } })

  if (!product) {
    return (
      <section className="space-y-4">
        <div className="rounded-3xl border border-white/40 bg-white/60 p-6 shadow-[0_20px_60px_-35px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <h1 className="text-2xl font-bold text-slate-900">Producto no encontrado</h1>
          <p className="mt-2 text-slate-700">
            ID recibido: <span className="font-mono">{id}</span>
          </p>

          <Link
            href="/productos"
            className="mt-4 inline-flex rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
          >
            Volver al catálogo
          </Link>
        </div>
      </section>
    )
  }

  const details = Array.isArray(product.details) ? product.details : []
  const stars = clampStars(product.rating || 0)
  const inStock = (product.stock ?? 0) > 0

  return (
    <section className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Link href="/productos" className="text-sm font-semibold text-slate-900 hover:underline">
          ← Volver
        </Link>

        <div className="hidden sm:flex items-center gap-2">
          <span className="rounded-full border border-white/40 bg-white/50 px-3 py-1 text-xs font-semibold text-slate-800 backdrop-blur">
            {product.category}
          </span>
          <span className="rounded-full border border-white/40 bg-white/50 px-3 py-1 text-xs font-semibold text-slate-800 backdrop-blur">
            ID: <span className="font-mono">{product.id}</span>
          </span>
        </div>
      </div>

      {/* TOP: Imagen + Info */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Card imagen (glass + glow) */}
        <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/35 p-5 shadow-[0_35px_90px_-55px_rgba(0,0,0,0.6)] backdrop-blur-xl">
          {/* glow */}
          <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-sky-400/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-rose-400/20 blur-3xl" />

          <div className="relative flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs text-slate-700">Imagen del producto</div>
              <div className="mt-1 truncate text-sm font-semibold text-slate-900">{product.name}</div>
            </div>

            <span
              className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur ${
                inStock
                  ? "border-emerald-200/60 bg-emerald-50/60 text-emerald-800"
                  : "border-slate-200/70 bg-white/50 text-slate-700"
              }`}
            >
              {inStock ? `En existencia (${product.stock})` : "Sin stock"}
            </span>
          </div>

          {/* ✅ AQUÍ VA EL REEMPLAZO: imagen con frame + zoom */}
          <ZoomImage src={product.image} alt={product.name} />

          {/* Chips mobile */}
          <div className="relative mt-4 flex flex-wrap gap-2 sm:hidden">
            <span className="rounded-full border border-white/40 bg-white/50 px-3 py-1 text-xs font-semibold text-slate-800 backdrop-blur">
              {product.category}
            </span>
            <span className="rounded-full border border-white/40 bg-white/50 px-3 py-1 text-xs font-semibold text-slate-800 backdrop-blur">
              ID: <span className="font-mono">{product.id}</span>
            </span>
          </div>
        </div>

        {/* Card info (glass diferente al resto) */}
        <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/35 p-6 shadow-[0_35px_90px_-55px_rgba(0,0,0,0.6)] backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/30" />
          <div className="pointer-events-none absolute -top-28 right-10 h-72 w-72 rounded-full bg-indigo-400/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 left-10 h-72 w-72 rounded-full bg-sky-400/15 blur-3xl" />

          <div className="relative">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">{product.name}</h1>
            <p className="mt-1 text-sm text-slate-700">{product.category}</p>

            {/* rating */}
            <div className="mt-3 flex items-center gap-2">
              <div className="text-amber-500 text-sm">
                {"★".repeat(stars)}
                <span className="text-slate-300">{"★".repeat(5 - stars)}</span>
              </div>
              <div className="text-sm text-slate-700">{Number(product.rating || 0).toFixed(1)}</div>
            </div>

            {/* precio */}
            <div className="mt-3 text-3xl font-black text-slate-900">${formatMoney(product.price)}</div>

            {/* descripcion */}
            <p className="mt-3 text-sm leading-relaxed text-slate-800">
              {product.description || "Sin descripción."}
            </p>

            {/* Acciones */}
            <div className="mt-6">
              <ProductActions
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  category: product.category,
                  stock: product.stock,
                }}
              />
            </div>

            {/* Mini stats */}
            <div className="mt-6 grid grid-cols-3 gap-2">
              <div className="rounded-2xl border border-white/40 bg-white/55 p-3 backdrop-blur">
                <div className="text-xs text-slate-600">Stock</div>
                <div className="mt-1 text-sm font-semibold text-slate-900">{product.stock}</div>
              </div>
              <div className="rounded-2xl border border-white/40 bg-white/55 p-3 backdrop-blur">
                <div className="text-xs text-slate-600">Rating</div>
                <div className="mt-1 text-sm font-semibold text-slate-900">
                  {Number(product.rating || 0).toFixed(1)}
                </div>
              </div>
              <div className="rounded-2xl border border-white/40 bg-white/55 p-3 backdrop-blur">
                <div className="text-xs text-slate-600">ID</div>
                <div className="mt-1 truncate text-sm font-semibold text-slate-900 font-mono">
                  {product.id}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DETALLES */}
      <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/35 p-6 shadow-[0_35px_90px_-55px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-sky-400/12 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-rose-400/10 blur-3xl" />

        <div className="relative flex items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold text-slate-900">Detalles</h2>
          <span className="text-xs text-slate-700">{details.length} item(s)</span>
        </div>

        {details.length === 0 ? (
          <p className="relative mt-2 text-sm text-slate-700">Sin detalles.</p>
        ) : (
          <ul className="relative mt-4 grid gap-2 sm:grid-cols-2">
            {details.map((d: any, i: number) => (
              <li
                key={i}
                className="rounded-2xl border border-white/45 bg-white/55 p-3 text-sm text-slate-900 backdrop-blur"
              >
                <span className="mr-2 text-slate-400">•</span>
                {String(d)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
