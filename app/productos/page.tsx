import Image from "next/image"
import Link from "next/link"
import { products } from "@/data/products"

export default function ProductosPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Productos</h1>
        <p className="mt-1 text-slate-600">Catálogo general</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/producto/${p.id}`}
            className="group rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            <div className="relative mb-4 h-44 overflow-hidden rounded-xl bg-slate-100">
              <Image
                src={p.image}
                alt={p.name}
                fill
                className="object-contain p-3 transition group-hover:scale-[1.02]"
              />
            </div>

            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">{p.name}</h2>
                <p className="text-sm text-slate-500">{p.category}</p>
              </div>
              <div className="font-bold">${p.price.toFixed(2)}</div>
            </div>

            <div className="mt-4 rounded-xl bg-sky-600 py-2 text-center text-white hover:bg-sky-700">
              Ver detalle
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
