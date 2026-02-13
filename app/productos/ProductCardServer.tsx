import Link from "next/link"

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

export default function ProductCardServer({
  id,
  name,
  category,
  image,
  description,
  price,
  stock,
  href,
}: Props) {
  const okImg = Boolean(image)
  const inStock = stock > 0

  // UI only (para parecerse al screenshot): descuento y precio anterior
  const discountPct = 25
  const oldPrice = Math.round((price / (1 - discountPct / 100)) * 100) / 100

  return (
    <div
      className="group overflow-hidden rounded-3xl bg-white
                 ring-1 ring-slate-200/70
                 shadow-[0_18px_55px_-30px_rgba(15,23,42,0.35)]
                 transition hover:-translate-y-1 hover:shadow-[0_28px_80px_-35px_rgba(15,23,42,0.45)]"
    >
      {/* Imagen tipo banner */}
      <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-100">
        {okImg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-xs text-slate-400">
            Sin imagen
          </div>
        )}

        {/* overlay suave para look pro */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

        {/* badge descuento */}
        <div className="absolute left-4 top-4">
          <span className="rounded-full bg-rose-500 px-3 py-1 text-xs font-bold text-white shadow">
            -{discountPct}%
          </span>
        </div>

        {/* corazón (decorativo) */}
        <div className="absolute right-4 top-4">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-white/95 shadow ring-1 ring-slate-200/70">
            <span className="text-slate-700 text-sm">♡</span>
          </div>
        </div>

        {/* stock pill */}
        <div className="absolute left-4 bottom-4">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold shadow ring-1 ${
              inStock
                ? "bg-emerald-50 text-emerald-800 ring-emerald-200/70"
                : "bg-slate-100 text-slate-700 ring-slate-200/70"
            }`}
          >
            {inStock ? "En stock" : "Agotado"}
          </span>
        </div>
      </div>

      {/* Contenido (más “largo” y limpio) */}
      <div className="p-5">
        {/* categoría mini */}
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-700">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-sky-50 ring-1 ring-sky-100">
            ⚡
          </span>
          <span className="truncate">{category || "Sin categoría"}</span>
        </div>

        <div className="mt-2 font-extrabold text-[15px] leading-tight line-clamp-2 text-slate-900">
          {name}
        </div>

        <p className="mt-2 text-sm text-slate-600 line-clamp-2">
          {description || "—"}
        </p>

        {/* precio + botón tipo “Book now” */}
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500">Precio</div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-black tracking-tight text-sky-700">
                ${money(price)}
              </div>
              <div className="text-xs text-slate-400 line-through">${money(oldPrice)}</div>
            </div>
          </div>

          <Link
            href={href}
            className="inline-flex items-center justify-center rounded-full bg-sky-600 px-4 py-2 text-xs font-bold text-white
                       shadow-[0_12px_25px_-14px_rgba(2,132,199,0.9)]
                       transition hover:brightness-110 active:scale-[0.98]"
          >
            Ver ahora
          </Link>
        </div>

        <div className="mt-3 text-[10px] text-slate-400 break-all">{id}</div>
      </div>
    </div>
  )
}
