"use client"

import Link from "next/link"
import { useMemo, useState } from "react"

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

function isSafeImg(src: string) {
  if (!src) return false
  // permite rutas locales y https
  if (src.startsWith("/")) return true
  if (src.startsWith("https://")) return true
  return false
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
  const [imgOk, setImgOk] = useState(true)

  const src = useMemo(() => (isSafeImg(image) ? image : ""), [image])

  return (
    <div className="rounded-3xl border bg-white shadow-sm overflow-hidden">
      {/* Imagen segura + fallback */}
      <div className="relative w-full h-36 sm:h-40 bg-slate-50">
        {src && imgOk ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={name}
            className="h-full w-full object-contain p-3"
            loading="lazy"
            onError={() => setImgOk(false)}
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

      <div className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="font-semibold leading-tight line-clamp-2">{name}</div>
            <div className="mt-1 text-xs text-slate-500">{category}</div>
          </div>

          <div className="shrink-0 font-bold">${money(price)}</div>
        </div>

        <p className="mt-2 text-xs text-slate-600 line-clamp-2">{description || "—"}</p>

        <Link
          href={href}
          className="mt-3 block rounded-2xl border bg-white px-3 py-2 text-center text-xs font-semibold hover:bg-slate-50"
        >
          Ver detalle
        </Link>

        <div className="mt-2 text-[10px] text-slate-400 text-center break-all">{id}</div>
      </div>
    </div>
  )
}
