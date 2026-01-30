"use client"

import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { products } from "@/data/products"
import GeneratePedidoButton from "./GeneratePedidoButton"

function formatMoney(n: number) {
  return n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
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

function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0) {
    return (
      <span className="inline-flex rounded-full bg-rose-100 px-3 py-1 text-sm font-semibold text-rose-700">
        Sin existencia
      </span>
    )
  }
  if (stock <= 5) {
    return (
      <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
        Pocas piezas ({stock})
      </span>
    )
  }
  return (
    <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
      En existencia ({stock})
    </span>
  )
}

export default function ProductoDetallePage() {
  const params = useParams() as { id?: string | string[] }
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id
  const id = decodeURIComponent(rawId ?? "").trim()

  const product = products.find((p) => p.id.trim().toLowerCase() === id.toLowerCase())

  if (!id || !product) {
    return (
      <section className="space-y-6">
        <div className="rounded-3xl border bg-white/70 p-6 shadow-lg">
          <h1 className="text-2xl font-bold">Producto no encontrado</h1>
          <p className="mt-2 text-slate-600">
            ID recibido: <span className="font-mono">{id || "(vacío)"}</span>
          </p>
        </div>

        <div className="rounded-3xl border bg-white/70 p-6 shadow-lg">
          <p className="font-semibold">IDs disponibles:</p>
          <ul className="mt-3 list-disc pl-6 text-slate-700">
            {products.map((x) => (
              <li key={x.id} className="font-mono">
                {x.id}
              </li>
            ))}
          </ul>
        </div>

        <Link
          href="/productos"
          className="inline-flex rounded-2xl bg-gradient-to-r from-sky-600 to-rose-600 px-6 py-3 font-semibold text-white hover:brightness-95"
        >
          Volver a Productos
        </Link>
      </section>
    )
  }

  const canOrder = product.stock > 0
  const waText = `Hola, quiero ordenar: ${product.name} ($${formatMoney(product.price)})`
  const waLink = `https://wa.me/5217715565797?text=${encodeURIComponent(waText)}`

  return (
    <section className="space-y-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Imagen */}
        <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/55 p-6 shadow-[0_18px_55px_-35px_rgba(2,132,199,0.55)] ring-1 ring-slate-900/5 backdrop-blur">
          <div className="relative h-80 w-full overflow-hidden rounded-2xl bg-white shadow-[inset_0_0_0_1px_rgba(15,23,42,0.06)]">
            <Image src={product.image} alt={product.name} fill className="object-contain p-6" priority />
          </div>
        </div>

        {/* Info */}
        <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/55 p-6 shadow-[0_18px_55px_-35px_rgba(2,132,199,0.55)] ring-1 ring-slate-900/5 backdrop-blur">
          <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-sky-300/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-rose-300/20 blur-3xl" />

          <div className="relative space-y-3">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <Stars rating={product.rating} />

            <div className="flex flex-wrap items-center gap-3">
              <div className="text-2xl font-bold">${formatMoney(product.price)}</div>
              <StockBadge stock={product.stock} />
            </div>

            <p className="text-slate-700">{product.description}</p>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <a
                href={canOrder ? waLink : undefined}
                target="_blank"
                className={[
                  "inline-flex items-center justify-center rounded-2xl px-6 py-3 font-semibold text-white",
                  "shadow-[0_14px_35px_-22px_rgba(2,132,199,0.65)]",
                  "bg-gradient-to-r from-sky-600 to-rose-600 hover:brightness-95",
                  !canOrder ? "pointer-events-none opacity-50" : "",
                ].join(" ")}
              >
                Ordenar
              </a>

              {/* ✅ AQUÍ VA EL BOTÓN NUEVO */}
              <GeneratePedidoButton
                id={product.id}
                name={product.name}
                price={product.price}
                disabled={!canOrder}
                className={[
                  "inline-flex items-center justify-center rounded-2xl border border-white/70 bg-white/70 px-6 py-3 font-semibold",
                  "shadow-[0_10px_25px_-15px_rgba(0,0,0,0.30)] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white",
                  !canOrder ? "pointer-events-none opacity-50" : "",
                ].join(" ")}
              />
            </div>

            {!canOrder && (
              <p className="text-sm font-semibold text-rose-700">Este producto está sin existencia por el momento.</p>
            )}
          </div>
        </div>
      </div>

      {/* Detalles */}
      <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/55 p-6 shadow-[0_18px_55px_-35px_rgba(2,132,199,0.55)] ring-1 ring-slate-900/5 backdrop-blur">
        <h2 className="text-xl font-bold">Detalles</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700">
          {product.details.map((d, idx) => (
            <li key={idx}>{d}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
