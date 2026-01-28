import Image from "next/image"
import Link from "next/link"
import { products } from "@/data/products"

function formatMoney(n: number) {
  return n.toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export default function ProductosPage() {
  // Agrupar por categoría
  const byCategory = products.reduce<Record<string, typeof products>>((acc, p) => {
    const key = p.category || "Otros"
    acc[key] = acc[key] ? [...acc[key], p] : [p]
    return acc
  }, {})

  const categories = Object.keys(byCategory).sort()

  return (
    <section className="space-y-8">
      {/* Encabezado con estilo premium */}
      <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/55 p-6 shadow-[0_18px_55px_-35px_rgba(2,132,199,0.55)] ring-1 ring-slate-900/5 backdrop-blur">
        <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-sky-300/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-rose-300/20 blur-3xl" />

        <h1 className="relative text-2xl font-bold">Productos</h1>
        <p className="relative mt-1 text-slate-600">Catálogo general</p>
      </div>

      {/* Tiras (carouseles) por categoría */}
      <div className="space-y-10">
        {categories.map((cat) => (
          <section key={cat} className="space-y-4">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">{cat}</h2>
                <p className="text-sm text-slate-600">Desliza para ver más productos</p>
              </div>
            </div>

            {/* wrapper como group para controlar el hint */}
            <div className="relative group">
              {/* La tira (más pro: snap + scroll suave) */}
              <div className="flex gap-5 overflow-x-auto pb-4 pr-6 scroll-smooth snap-x snap-mandatory">
                {byCategory[cat].map((p) => (
                  <Link
                    key={p.id}
                    href={`/producto/${p.id}`}
                    className="group snap-start relative w-[260px] shrink-0 overflow-hidden rounded-3xl border border-white/60 bg-white/55 p-4 shadow-[0_18px_55px_-35px_rgba(2,132,199,0.45)] ring-1 ring-slate-900/5 backdrop-blur transition hover:-translate-y-1 hover:bg-white/70 hover:shadow-[0_28px_80px_-45px_rgba(2,132,199,0.6)]"
                  >
                    <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-sky-300/20 blur-2xl" />

                    <div className="relative mb-3 h-36 overflow-hidden rounded-2xl bg-white shadow-[inset_0_0_0_1px_rgba(15,23,42,0.06)]">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-contain p-4 transition group-hover:scale-[1.03]"
                      />
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold">{p.name}</h3>
                        <p className="text-sm text-slate-500">{p.category}</p>
                      </div>
                      <div className="whitespace-nowrap font-bold">
                        ${formatMoney(p.price)}
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl bg-gradient-to-r from-sky-600 to-rose-600 py-2 text-center text-sm font-semibold text-white shadow-[0_14px_35px_-22px_rgba(2,132,199,0.65)] hover:brightness-95">
                      Ver detalle
                    </div>
                  </Link>
                ))}
              </div>

              {/* Hint visual bonito (ya no bloque feo): solo aparece al hover */}
              <div className="pointer-events-none absolute inset-y-0 right-0 w-12 opacity-0 transition group-hover:opacity-100">
                <div className="h-full w-full bg-gradient-to-l from-slate-50/80 to-transparent backdrop-blur-sm" />
              </div>
            </div>
          </section>
        ))}
      </div>
    </section>
  )
}
