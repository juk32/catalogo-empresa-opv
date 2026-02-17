"use client"

export default function ProductsTopBar({
  q,
  setQ,
  category,
  setCategory,
  categories,
  sort,
  setSort,
  count,
  onReload,
}: {
  q: string
  setQ: (v: string) => void
  category: string
  setCategory: (v: string) => void
  categories: string[]
  sort: string
  setSort: (v: string) => void
  count: number
  onReload?: () => void
}) {
  return (
    <div className="sticky top-0 z-30 -mx-4 px-4 pt-3 pb-3">
      <div className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-2xl shadow-[0_18px_55px_-40px_rgba(2,6,23,0.18)]">
        <div className="p-4">
          <div className="flex flex-col gap-3">
            {/* Row 1 */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-extrabold text-slate-900">Filtros</p>
                <p className="text-xs text-slate-500">
                  {count} productos • Tip: usa el buscador para ID exacto o nombre.
                </p>
              </div>

              <button
                type="button"
                onClick={onReload}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm hover:bg-white transition"
              >
                ↻ Recargar
              </button>
            </div>

            {/* Row 2 */}
            <div className="grid gap-3 sm:grid-cols-[1fr_220px_210px]">
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  ⌕
                </span>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Buscar por nombre, categoría o ID…"
                  className="w-full rounded-2xl border border-slate-200 bg-white/80 pl-9 pr-3 py-3 text-sm outline-none transition focus:border-slate-300"
                />
              </div>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white/80 px-3 py-3 text-sm outline-none transition focus:border-slate-300"
              >
                <option value="">Todas</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white/80 px-3 py-3 text-sm outline-none transition focus:border-slate-300"
              >
                <option value="relevance">Orden: relevancia</option>
                <option value="price_asc">Precio: menor a mayor</option>
                <option value="price_desc">Precio: mayor a menor</option>
                <option value="rating_desc">Mejor calificados</option>
                <option value="stock_desc">Más stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* Línea neon sutil */}
        <div className="h-1 w-full bg-gradient-to-r from-cyan-500/40 via-indigo-500/40 to-fuchsia-500/40 opacity-70" />
      </div>
    </div>
  )
}
