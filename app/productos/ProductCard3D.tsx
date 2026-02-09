"use client"

import Link from "next/link"
import Image from "next/image"

type Props = {
  id: string
  name: string
  category: string
  image: string
  description: string
  price: number
  stock: number
  href: string
}

function money(n: number) {
  return n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function ProductCard3D({
  id,
  name,
  category,
  image,
  description,
  price,
  stock,
  href,
}: Props) {
  return (
    <div className="rounded-3xl border bg-white shadow-sm overflow-hidden">
      {/* Imagen: SIEMPRE con altura (clave para móvil) */}
      <div className="relative w-full h-36 sm:h-40 bg-slate-50">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-3"
            priority={false}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-xs text-slate-400">
            Sin imagen
          </div>
        )}

        <div className="absolute right-2 top-2 rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-700">
          {stock > 0 ? "En stock" : "Agotado"}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="font-semibold leading-tight line-clamp-2">{name}</div>
            <div className="mt-1 text-xs text-slate-500">{category}</div>
          </div>

          <div className="shrink-0 font-bold">${money(price)}</div>
        </div>

        <p className="mt-2 text-xs text-slate-600 line-clamp-2">
          {description || "—"}
        </p>

        <Link
          href={href}
          className="mt-3 block rounded-2xl border bg-white px-3 py-2 text-center text-xs font-semibold hover:bg-slate-50"
        >
          Ver detalle
        </Link>

        <div className="mt-2 text-[10px] text-slate-400 text-center break-all">
          {id}
        </div>
      </div>
    </div>
  )
}
