import Link from "next/link"
import HomeSection from "@/components/HomeSections"

export default function HomePage() {
  return (
    <main className="relative overflow-hidden">
      {/* Fondo Apple Neon Clear */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Base blanca limpia */}
        <div className="absolute inset-0 bg-white" />

        {/* Glow superior elegante */}
        <div className="absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-cyan-300/30 blur-[120px]" />
        <div className="absolute top-10 left-10 h-[400px] w-[400px] rounded-full bg-indigo-300/20 blur-[130px]" />
        <div className="absolute top-20 right-10 h-[400px] w-[400px] rounded-full bg-fuchsia-300/20 blur-[130px]" />
      </div>

      {/* HERO */}
      <section className="relative rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-2xl shadow-[0_25px_70px_-25px_rgba(0,0,0,0.15)] overflow-hidden">
        <div className="p-6 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-medium text-slate-700">
                Operadora Balles • Catálogo
              </span>

              <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                Encuentra y explora tus{" "}
                <span className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-500 bg-clip-text text-transparent">
                  productos
                </span>{" "}
                favoritos
              </h1>

              <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-xl">
                Búsqueda rápida, detalle claro y una experiencia bonita en computadora y celular.
              </p>

              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/productos"
                  className="rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white px-6 py-3 text-sm font-semibold shadow-lg transition hover:scale-[1.02] hover:shadow-[0_20px_45px_-15px_rgba(59,130,246,0.6)] text-center"
                >
                  Ver productos
                </Link>

                <Link
                  href="/contacto"
                  className="rounded-2xl border border-slate-200 bg-white text-slate-800 px-6 py-3 text-sm font-semibold shadow-sm transition hover:bg-slate-50 hover:shadow-md text-center"
                >
                  Contacto
                </Link>
              </div>

              {/* Barra tipo “chips” (opcional estética) */}
              <div className="mt-7 flex flex-wrap gap-2">
                <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-700">
                  Búsqueda rápida
                </span>
                <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-700">
                  Móvil 2/1 columnas
                </span>
                <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-700">
                  Detalle claro
                </span>
              </div>
            </div>

            {/* Tarjeta lateral (sin duplicar navbar) */}
            <div className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-2xl p-6 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.25)]">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">Resumen</p>
                <span className="text-xs text-slate-500">Actualizado</span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/80 border border-slate-200 p-4 shadow-[0_12px_30px_-25px_rgba(2,6,23,0.18)]">
                  <p className="text-xs text-slate-500">Productos</p>
                  <p className="mt-1 text-lg font-extrabold text-slate-900">+100</p>
                </div>
                <div className="rounded-2xl bg-white/80 border border-slate-200 p-4 shadow-[0_12px_30px_-25px_rgba(2,6,23,0.18)]">
                  <p className="text-xs text-slate-500">Categorías</p>
                  <p className="mt-1 text-lg font-extrabold text-slate-900">Varias</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-gradient-to-r from-cyan-500/10 via-indigo-500/10 to-fuchsia-500/10 p-4">
                <p className="text-xs text-slate-600">Tip</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  En móvil se adapta solo: 2 columnas cuando se puede y 1 cuando es necesario.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Línea inferior tipo Apple */}
        <div className="h-1 w-full bg-gradient-to-r from-cyan-500/70 via-indigo-500/70 to-fuchsia-500/70 opacity-80" />
      </section>

      {/* SECCIONES con reveal */}
      <div className="mt-6 sm:mt-8 grid gap-5 sm:gap-6">
        <HomeSection
          title="Lo más buscado"
          subtitle="Secciones que aparecen suave al bajar."
          delay={0}
        >
          <div className="grid gap-3 min-[420px]:grid-cols-2 lg:grid-cols-4">
            {[
              { t: "Lácteos", d: "Leches, cremas, etc." },
              { t: "Abarrotes", d: "Básicos del día a día." },
              { t: "Congelados", d: "Listo para cocina." },
              { t: "Accesorios", d: "Extras y complementos." },
            ].map((x) => (
              <div
                key={x.t}
                className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-[0_12px_30px_-25px_rgba(2,6,23,0.18)] transition hover:-translate-y-1 hover:shadow-[0_22px_45px_-35px_rgba(2,6,23,0.28)]"
              >
                <p className="text-sm font-bold text-slate-900">{x.t}</p>
                <p className="mt-1 text-xs text-slate-600">{x.d}</p>
              </div>
            ))}
          </div>
        </HomeSection>

        <HomeSection
          title="¿Cómo funciona?"
          subtitle="3 pasos simples, sin complicarte."
          delay={80}
        >
          <div className="grid gap-3 lg:grid-cols-3">
            {[
              { n: "1", t: "Explora", d: "Busca por nombre o categoría." },
              { n: "2", t: "Selecciona", d: "Entra a detalle y revisa stock." },
              { n: "3", t: "Genera", d: "Arma tu pedido y compártelo." },
            ].map((x) => (
              <div
                key={x.n}
                className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-5 shadow-[0_18px_55px_-45px_rgba(2,6,23,0.22)]"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-extrabold">
                    {x.n}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{x.t}</p>
                    <p className="text-xs text-slate-600">{x.d}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </HomeSection>

        <HomeSection
          title="Acciones rápidas"
          subtitle="Botones grandes, cómodos en móvil."
          delay={140}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/productos"
              className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm transition hover:bg-white hover:shadow-md"
            >
              <p className="text-sm font-extrabold text-slate-900">Ir a productos →</p>
              <p className="mt-1 text-xs text-slate-600">Catálogo completo</p>
            </Link>

            <Link
              href="/generar-pedido"
              className="rounded-2xl bg-slate-900 text-white p-5 shadow transition hover:opacity-95 hover:shadow-[0_20px_55px_-35px_rgba(2,6,23,0.55)]"
            >
              <p className="text-sm font-extrabold">Generar pedido →</p>
              <p className="mt-1 text-xs text-white/70">Arma tu lista rápido</p>
            </Link>
          </div>
        </HomeSection>
      </div>

      <div className="h-10" />
    </main>
  )
}
