import Link from "next/link"
import { prisma } from "@/lib/prisma"
import ProductActions from "./ProductActions"
import ZoomImage from "./ZoomImage"
import RelatedCarouselClient from "./RelatedCarouselClient"

export const runtime = "nodejs"

function formatMoney(n: number) {
  return n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

type Ctx = { params: Promise<{ id: string }> }

function clampStars(n: number) {
  const v = Math.round(Number(n) || 0)
  return Math.max(0, Math.min(5, v))
}

function safeStr(v: any) {
  return typeof v === "string" ? v : String(v ?? "")
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

  // Relacionados: misma familia
  const related =
    product.category
      ? await prisma.product.findMany({
          where: { category: product.category, NOT: { id: product.id } },
          orderBy: [{ stock: "desc" }, { rating: "desc" }, { name: "asc" }],
          take: 12,
          select: { id: true, name: true, price: true, image: true, category: true, rating: true, stock: true },
        })
      : []

  return (
    <section className="relative space-y-4 overflow-hidden">
      {/* Fondo global */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute -top-44 left-1/2 h-[520px] w-[940px] -translate-x-1/2 rounded-full bg-sky-200/30 blur-[140px]" />
        <div className="absolute top-12 right-[-220px] h-[520px] w-[520px] rounded-full bg-rose-200/22 blur-[150px]" />
        <div className="absolute bottom-[-240px] left-[-240px] h-[640px] w-[640px] rounded-full bg-indigo-200/18 blur-[170px]" />
      </div>

      {/* Top bar */}
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/productos"
          className="inline-flex items-center gap-2 rounded-2xl border border-white/60 bg-white/70 px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur hover:bg-white/85"
        >
          <span>←</span> Volver
        </Link>

        <div className="hidden sm:flex items-center gap-2">
          <span className="rounded-full border border-white/55 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-800 backdrop-blur">
            {product.category || "Sin categoría"}
          </span>
          <span className="rounded-full border border-white/55 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-800 backdrop-blur">
            ID: <span className="font-mono">{product.id}</span>
          </span>
        </div>
      </div>

      {/* HERO compactado */}
      <div className="relative overflow-hidden rounded-3xl border border-white/55 bg-white/55 p-4 shadow-[0_24px_70px_-55px_rgba(15,23,42,.55)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 opacity-[0.10] [background:linear-gradient(135deg,rgba(56,189,248,.95),rgba(99,102,241,.92),rgba(244,63,94,.88))]" />

        <div className="relative flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <div className="text-[11px] font-extrabold text-slate-600">Producto</div>
            <h1 className="mt-0.5 truncate text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
              {product.name}
            </h1>
            <p className="mt-0.5 text-sm text-slate-700 line-clamp-1">
              {product.description || "Sin descripción."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={[
                "rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur",
                inStock
                  ? "border-emerald-200/70 bg-emerald-50/70 text-emerald-800"
                  : "border-slate-200/70 bg-white/70 text-slate-700",
              ].join(" ")}
            >
              {inStock ? `Stock (${product.stock})` : "Sin stock"}
            </span>

            <span className="rounded-full border border-white/55 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-800 backdrop-blur">
              ${formatMoney(product.price)}
            </span>

            <span className="rounded-full border border-white/55 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-800 backdrop-blur">
              <span className="text-amber-500">
                {"★".repeat(stars)}
                <span className="text-slate-300">{"★".repeat(5 - stars)}</span>
              </span>
              <span className="ml-2 text-slate-700">{Number(product.rating || 0).toFixed(1)}</span>
            </span>
          </div>
        </div>

        {/* Chips mobile */}
        <div className="relative mt-2 flex flex-wrap gap-2 sm:hidden">
          <span className="rounded-full border border-white/55 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-800 backdrop-blur">
            {product.category || "Sin categoría"}
          </span>
          <span className="rounded-full border border-white/55 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-800 backdrop-blur">
            ID: <span className="font-mono">{product.id}</span>
          </span>
        </div>
      </div>

      {/* MAIN */}
      <div className="grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
        {/* Imagen */}
        <div className="relative overflow-hidden rounded-3xl border border-white/55 bg-white/55 p-4 shadow-[0_28px_80px_-60px_rgba(15,23,42,.6)] backdrop-blur-xl">
          <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-sky-400/16 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-rose-400/12 blur-3xl" />

          <div className="relative flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs text-slate-700">Vista</div>
              <div className="mt-0.5 truncate text-sm font-semibold text-slate-900">Zoom / detalle</div>
            </div>
          </div>

          <div className="relative mt-3 overflow-hidden rounded-3xl border border-white/55 bg-white/65 p-2 shadow-[0_18px_60px_-50px_rgba(15,23,42,.6)]">
            <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background:linear-gradient(135deg,rgba(56,189,248,.95),rgba(99,102,241,.92),rgba(244,63,94,.88))]" />
            <div className="relative">
              <ZoomImage src={product.image} alt={product.name} />
            </div>
          </div>

          {/* Mini stats (compactas) */}
          <div className="relative mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div className="rounded-2xl border border-white/55 bg-white/70 p-3 backdrop-blur">
              <div className="text-[11px] text-slate-600">Stock</div>
              <div className="mt-0.5 text-sm font-semibold text-slate-900">{product.stock ?? 0}</div>
            </div>
            <div className="rounded-2xl border border-white/55 bg-white/70 p-3 backdrop-blur">
              <div className="text-[11px] text-slate-600">Categoría</div>
              <div className="mt-0.5 text-sm font-semibold text-slate-900 truncate">{product.category || "—"}</div>
            </div>

            <div className="rounded-2xl border border-white/55 bg-white/70 p-3 backdrop-blur sm:block hidden">
              <div className="text-[11px] text-slate-600">ID</div>
              <div className="mt-0.5 text-sm font-semibold text-slate-900 font-mono truncate">{product.id}</div>
            </div>

            <div className="rounded-2xl border border-white/55 bg-white/70 p-3 backdrop-blur sm:hidden col-span-2">
              <div className="text-[11px] text-slate-600">ID</div>
              <div className="mt-0.5 text-sm font-semibold text-slate-900 font-mono truncate">{product.id}</div>
            </div>
          </div>
        </div>

        {/* Columna derecha: COMPRA + DETALLES abajo */}
        <div className="space-y-4">
          {/* Compra (sticky desktop) */}
          <div className="lg:sticky lg:top-[calc(var(--header-offset,72px)+12px)]">
            <div className="relative overflow-hidden rounded-3xl border border-white/55 bg-white/60 p-4 shadow-[0_28px_80px_-60px_rgba(15,23,42,.6)] backdrop-blur-xl">
              <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-indigo-400/12 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-sky-400/12 blur-3xl" />

              <div className="relative">
                <div className="text-[11px] font-extrabold text-slate-600">Compra</div>

                <div className="mt-2 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                      ${formatMoney(product.price)}
                    </div>
                    <div className="mt-1 text-sm text-slate-700">
                      {inStock ? "Disponible para pedido" : "No disponible por ahora"}
                    </div>
                  </div>

                  <span
                    className={[
                      "shrink-0 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur",
                      inStock
                        ? "border-emerald-200/70 bg-emerald-50/70 text-emerald-800"
                        : "border-slate-200/70 bg-white/70 text-slate-700",
                    ].join(" ")}
                  >
                    {inStock ? "OK" : "OFF"}
                  </span>
                </div>

                <div className="mt-4">
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

                <div className="mt-4 grid gap-2">
                  <div className="rounded-2xl border border-white/55 bg-white/70 p-3 text-sm text-slate-800 backdrop-blur">
                    <span className="mr-2 text-slate-400">✓</span> Datos y stock visibles
                  </div>
                  <div className="rounded-2xl border border-white/55 bg-white/70 p-3 text-sm text-slate-800 backdrop-blur">
                    <span className="mr-2 text-slate-400">✓</span> Compatible móvil/tablet
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ✅ DETALLES aquí, abajito de compra (compactos) */}
          <div className="relative overflow-hidden rounded-3xl border border-white/55 bg-white/55 p-4 shadow-[0_24px_70px_-55px_rgba(15,23,42,.55)] backdrop-blur-xl">
            <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-rose-400/8 blur-3xl" />

            <div className="relative flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-extrabold text-slate-600">Información</div>
                <h2 className="mt-0.5 text-base font-extrabold text-slate-900">Detalles</h2>
              </div>
              <span className="text-xs text-slate-700">{details.length} item(s)</span>
            </div>

            {details.length === 0 ? (
              <p className="relative mt-2 text-sm text-slate-700">Sin detalles.</p>
            ) : (
              <div className="relative mt-3 flex flex-wrap gap-2">
                {details.slice(0, 12).map((d: any, i: number) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-2 rounded-full border border-white/55 bg-white/70 px-3 py-2 text-sm text-slate-900 shadow-sm backdrop-blur"
                  >
                    <span className="text-slate-400">•</span>
                    {safeStr(d)}
                  </span>
                ))}
                {details.length > 12 ? (
                  <span className="inline-flex items-center rounded-full border border-white/55 bg-white/70 px-3 py-2 text-sm text-slate-700 shadow-sm backdrop-blur">
                    +{details.length - 12} más
                  </span>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Carrusel (ahora se aprecia antes) */}
      {related.length ? <RelatedCarouselClient title={`Productos de ${product.category}`} items={related} /> : null}
    </section>
  )
}