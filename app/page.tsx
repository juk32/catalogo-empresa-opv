import Link from "next/link"
import HomeSection from "@/components/HomeSections"

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="chip-neon">{children}</span>
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-neon rounded-2xl p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-extrabold text-slate-900">{value}</p>
    </div>
  )
}

export default function HomePage() {
  return (
    <main className="relative overflow-hidden">
      {/* ORBS animados (neon) */}
      <div className="neon-orbs pointer-events-none absolute inset-0 -z-10" />

      {/* HERO */}
      <section className="hero-neon neon-border-anim noise relative overflow-hidden rounded-3xl">
        {/* glow sweep */}
        <div className="neon-sweep absolute inset-0" />

        <div className="relative p-6 sm:p-10">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            {/* Texto */}
            <div>
              <span className="chip-neon">
                Operadora Balles • Catálogo
              </span>

              <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                Encuentra y explora tus{" "}
                <span className="neon-text">
                  productos
                </span>{" "}
                favoritos
              </h1>

              <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-xl">
                Búsqueda rápida, detalle claro y una experiencia bonita en computadora y celular.
              </p>

              {/* CTAs */}
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <Link href="/productos" className="cta-neon">
                  Ver productos
                </Link>

                <Link href="/contacto" className="cta-ghost-neon">
                  Contacto
                </Link>
              </div>

              {/* Chips */}
              <div className="mt-7 flex flex-wrap gap-2">
                <Chip>⚡ Búsqueda rápida</Chip>
                <Chip>📱 Móvil 2/1 columnas</Chip>
                <Chip>🧾 Detalle claro</Chip>
                <Chip>🕒 Horarios de entrega</Chip>
              </div>
            </div>

            {/* Panel derecho */}
            <div className="relative">
              {/* halo red/blue */}
              <div className="pointer-events-none absolute -inset-10 -z-10 rounded-[40px] bg-gradient-to-br from-cyan-300/18 via-indigo-300/12 to-rose-300/18 blur-2xl" />

              <div className="grid gap-4">
                {/* Device mock */}
                <div className="card-neon neon-border-anim soft-float rounded-[32px] overflow-hidden">
                  <div className="h-10 border-b border-slate-200/70 bg-white/70 flex items-center gap-2 px-4">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                    <span className="ml-3 text-xs text-slate-500">Vista previa</span>
                  </div>

                  <div className="p-5">
                    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-semibold text-slate-700">Catálogo</div>
                        <div className="text-[11px] text-slate-500">Neon Red</div>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-3">
                        {["Leche", "Abarrote", "Queso", "Crema", "Helado", "Accesorio"].map((t) => (
                          <div
                            key={t}
                            className="rounded-xl border border-slate-200 bg-white p-3 shadow-[0_12px_24px_-18px_rgba(2,6,23,0.20)]"
                          >
                            <div className="h-8 w-full rounded-lg bg-gradient-to-r from-cyan-100 via-indigo-100 to-rose-100" />
                            <div className="mt-2 h-2 w-3/4 rounded bg-slate-200" />
                            <div className="mt-1 h-2 w-1/2 rounded bg-slate-200" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="h-1 w-full bg-gradient-to-r from-cyan-500/70 via-indigo-500/60 to-rose-500/70 opacity-85" />
                </div>

                {/* Resumen */}
                <div className="card-neon neon-border-anim rounded-3xl p-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">Resumen</p>
                    <span className="text-xs text-slate-500">Actualizado</span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <StatCard label="Productos" value="+100" />
                    <StatCard label="Categorías" value="Varias" />
                  </div>

                  <div className="mt-4 rounded-2xl border border-slate-200 bg-gradient-to-r from-cyan-500/10 via-indigo-500/10 to-rose-500/14 p-4">
                    <p className="text-xs text-slate-600">Tip</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      En móvil se adapta solo: 2 columnas cuando se puede y 1 cuando es necesario.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* mini “scanline” suave al fondo del hero */}
          <div className="scanline pointer-events-none absolute inset-0 opacity-[0.25]" />
        </div>
      </section>

      {/* DESTACADOS */}
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {[
          { t: "Catálogo claro", d: "Nombre, precio, stock y detalles bien presentados." },
          { t: "Rápido y cómodo", d: "Buscador y filtros listos para encontrar todo." },
          { t: "Listo para pedidos", d: "Genera pedidos sin complicarte." },
        ].map((x) => (
          <div key={x.t} className="card-neon neon-border-anim rounded-3xl p-5 transition hover:-translate-y-1">
            <p className="text-sm font-extrabold text-slate-900">{x.t}</p>
            <p className="mt-1 text-sm text-slate-600">{x.d}</p>
            <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          </div>
        ))}
      </div>

      {/* SECCIONES */}
      <div className="mt-6 sm:mt-8 grid gap-5 sm:gap-6">
        <HomeSection title="Lo más buscado" subtitle="Secciones que aparecen suave al bajar." delay={0}>
          <div className="grid gap-3 min-[420px]:grid-cols-2 lg:grid-cols-4">
            {[
              { t: "Lácteos", d: "Leches, cremas, etc." },
              { t: "Abarrotes", d: "Básicos del día a día." },
              { t: "Congelados", d: "Listo para cocina." },
              { t: "Accesorios", d: "Extras y complementos." },
            ].map((x) => (
              <div key={x.t} className="card-neon rounded-2xl p-4 transition hover:-translate-y-1">
                <p className="text-sm font-bold text-slate-900">{x.t}</p>
                <p className="mt-1 text-xs text-slate-600">{x.d}</p>
              </div>
            ))}
          </div>
        </HomeSection>

        <HomeSection title="Acciones rápidas" subtitle="Botones grandes, cómodos en móvil." delay={120}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/productos" className="card-neon neon-border-anim rounded-2xl p-5 transition hover:-translate-y-1">
              <p className="text-sm font-extrabold text-slate-900">Ir a productos →</p>
              <p className="mt-1 text-xs text-slate-600">Catálogo completo</p>
            </Link>

            <Link href="/generar-pedido" className="cta-dark-neon rounded-2xl p-5">
              <p className="text-sm font-extrabold">Generar pedido →</p>
              <p className="mt-1 text-xs text-white/75">Arma tu lista rápido</p>
            </Link>
          </div>
        </HomeSection>
      </div>

      <div className="h-10" />
    </main>
  )
}
