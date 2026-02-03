import Image from "next/image"
import Link from "next/link"
import { products } from "@/src/data/products"

function formatMoney(n: number) {
  return n.toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export default function ProductosPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Productos</h1>
        <p className="mt-1 text-slate-600">Catálogo general</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {products.map((p) => (
          <div
            key={p.id}
            className="group rounded-3xl border bg-white/70 p-4 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative mb-4 h-44 overflow-hidden rounded-2xl bg-white">
              <Image
                src={p.image}
                alt={p.name}
                fill
                className="object-contain p-3 transition group-hover:scale-105"
              />
            </div>

            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">{p.name}</h2>
                <p className="text-sm text-slate-500">{p.category}</p>
              </div>
              <div className="font-bold">
                ${formatMoney(p.price)}
              </div>
            </div>

            {/* 🔴 LINK CORRECTO */}
            <Link
              href={`/producto/${p.id}`}
              className="mt-4 block rounded-2xl bg-gradient-to-r from-sky-600 to-rose-600 py-2 text-center font-semibold text-white shadow hover:brightness-95"
            >
              Ver detalle
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
