import Image from "next/image"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import ProductActions from "./ProductActions"

export const runtime = "nodejs"

function formatMoney(n: number) {
  return n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function safeImageSrc(src: string | null | undefined) {
  if (!src) return "/placeholder.png"
  if (src.startsWith("/") || src.startsWith("http")) return src
  return "/placeholder.png"
}

type Ctx = { params: Promise<{ id: string }> }

export default async function ProductoDetallePage({ params }: Ctx) {
  const { id: rawId } = await params
  const id = decodeURIComponent(rawId)

  const product = await prisma.product.findUnique({ where: { id } })

  if (!product) {
    return (
      <section className="space-y-4">
        <div className="rounded-3xl border bg-white/70 p-6">
          <h1 className="text-2xl font-bold">Producto no encontrado</h1>
          <p className="mt-2 text-slate-600">ID recibido: {id}</p>

          <Link
            href="/productos"
            className="mt-4 inline-block rounded-2xl bg-black px-4 py-2 text-sm font-semibold text-white"
          >
            Volver al catálogo
          </Link>
        </div>
      </section>
    )
  }

  const details = Array.isArray(product.details) ? product.details : []

  return (
    <section className="space-y-6">
      <Link href="/productos" className="text-sm font-semibold text-slate-700 hover:underline">
        ← Volver
      </Link>

      {/* TOP: Imagen + Info */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* CARD IMAGEN */}
        <div className="rounded-3xl border bg-white/70 p-5 shadow-sm backdrop-blur">
          <div className="relative h-80 overflow-hidden rounded-2xl bg-white">
            <Image
              src={safeImageSrc(product.image)}
              alt={product.name}
              fill
              className="object-contain p-6"
              priority
            />
          </div>
        </div>

        {/* CARD INFO */}
        <div className="rounded-3xl border bg-gradient-to-br from-sky-100/70 to-rose-100/60 p-6 shadow-sm backdrop-blur">
          <h1 className="text-2xl font-bold">{product.name}</h1>

          {/* rating */}
          <div className="mt-2 flex items-center gap-2">
            <div className="text-amber-500 text-sm">
              {"★".repeat(Math.max(0, Math.min(5, Math.round(product.rating || 0))))}
              <span className="text-slate-400">
                {"★".repeat(5 - Math.max(0, Math.min(5, Math.round(product.rating || 0))))}
              </span>
            </div>
            <div className="text-sm text-slate-600">{Number(product.rating || 0).toFixed(1)}</div>
          </div>

          {/* precio */}
          <div className="mt-2 text-2xl font-bold">${formatMoney(product.price)}</div>

          {/* stock */}
          <div className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
            {product.stock > 0 ? `En existencia (${product.stock})` : "Sin stock"}
          </div>

          {/* descripcion */}
          <p className="mt-3 text-sm text-slate-700">{product.description}</p>

          {/* BOTONES (como tu captura) */}
          <div className="mt-5">
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
        </div>
      </div>

      {/* DETALLES ABAJO */}
      <div className="rounded-3xl border bg-white/70 p-6 shadow-sm backdrop-blur">
        <h2 className="text-lg font-bold">Detalles</h2>

        {details.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">Sin detalles.</p>
        ) : (
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
            {details.map((d: any, i: number) => (
              <li key={i}>{String(d)}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
