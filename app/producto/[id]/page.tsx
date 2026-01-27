import Image from "next/image"
import { notFound } from "next/navigation"
import { products } from "@/data/products"

type Props = {
  params: { id: string }
}

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating)
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < full ? "text-yellow-500" : "text-slate-300"}>
          ★
        </span>
      ))}
      <span className="ml-2 text-sm text-slate-500">{rating.toFixed(1)}</span>
    </div>
  )
}

export default function ProductoDetallePage({ params }: Props) {
  const product = products.find((p) => p.id === params.id)
  if (!product) return notFound()

  return (
    <section className="space-y-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="rounded-2xl border bg-white p-6">
          <div className="relative h-72 w-full overflow-hidden rounded-xl bg-slate-100">
            <Image src={product.image} alt={product.name} fill className="object-contain p-6" />
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6 space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <Stars rating={product.rating} />
          <p className="text-slate-600">{product.description}</p>

          <div className="text-2xl font-bold">${product.price.toFixed(2)}</div>

          <a
            href={`https://wa.me/5217715565797?text=${encodeURIComponent(
              `Hola, quiero ordenar: ${product.name} ($${product.price.toFixed(2)})`
            )}`}
            target="_blank"
            className="inline-flex items-center justify-center rounded-2xl bg-sky-600 px-6 py-3 font-semibold text-white hover:bg-sky-700"
          >
            Ordenar
          </a>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-6">
        <h2 className="text-xl font-bold mb-3">Detalles</h2>
        <ul className="list-disc pl-6 text-slate-700 space-y-1">
          {product.details.map((d, idx) => (
            <li key={idx}>{d}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
