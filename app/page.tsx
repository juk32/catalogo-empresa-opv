import Image from "next/image"
import Link from "next/link"



export default function HomePage() {
  return (
    <section className="space-y-8">
      {/* HERO tipo mockup (con glow + 3D) */}
      <div className="relative">
        {/* Glow decorativo */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-sky-300/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-indigo-300/30 blur-3xl" />

        <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-sky-50 p-6 shadow-[0_18px_50px_-20px_rgba(2,132,199,0.45)] ring-1 ring-slate-900/5">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
            {/* Texto izquierda */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-slate-900">Bienvenido</h1>

              <p className="max-w-xl text-slate-600">
                En <span className="font-semibold">Operadora Balles</span> te
                compartimos un catálogo claro y actualizado para que encuentres
                productos fácilmente, revises su detalle y puedas generar tu
                pedido en minutos. Nuestro objetivo es agilizar tu compra y
                mejorar tu experiencia con un proceso simple y rápido.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/productos"
                  className="rounded-2xl border border-white/70 bg-white/80 px-6 py-3 font-semibold shadow-[0_10px_25px_-15px_rgba(0,0,0,0.35)] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_18px_45px_-20px_rgba(0,0,0,0.35)]"
                >
                  Productos
                </Link>
                <Link
                  href="/generar-pedido"
                  className="rounded-2xl border border-white/70 bg-white/80 px-6 py-3 font-semibold shadow-[0_10px_25px_-15px_rgba(0,0,0,0.35)] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_18px_45px_-20px_rgba(0,0,0,0.35)]"
                >
                  Generar pedido
                </Link>
                <Link
                  href="/contacto"
                  className="rounded-2xl border border-white/70 bg-white/80 px-6 py-3 font-semibold shadow-[0_10px_25px_-15px_rgba(0,0,0,0.35)] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_18px_45px_-20px_rgba(0,0,0,0.35)]"
                >
                  Contacto
                </Link>
              </div>
            </div>

            {/* Imagen derecha */}
            <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-3xl border border-white/70 bg-white/70 p-4 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
              <div className="relative h-72 w-full md:h-80">
                <Image
                  src="/home/hero.jpg"
                  alt="Hero"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mini carrusel / ofertas (3 tarjetas) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          { img: "/home/nutella.png", off: "20%", label: "producto", btn: "pedido" },
          { img: "/home/canasta.jpg", off: "20%", label: "producto", btn: "pedido" },
          { img: "/home/chocolate.png", off: "15%", label: "producto", btn: "pedido" },
        ].map((c, idx) => (
          <div
            key={idx}
            className="group flex items-center justify-between gap-4 rounded-3xl border border-white/60 bg-white/50 p-5 shadow-[0_14px_40px_-26px_rgba(2,132,199,0.55)] ring-1 ring-slate-900/5 backdrop-blur transition hover:-translate-y-1 hover:bg-white/70 hover:shadow-[0_22px_60px_-30px_rgba(2,132,199,0.6)]"
          >
            <div className="space-y-2">
              <div className="text-sm text-slate-600">{c.label}</div>
              <div className="text-2xl font-bold">{c.off}</div>
              <span className="inline-flex rounded-full bg-white px-3 py-1 text-sm shadow-sm">
                {c.btn}
              </span>
            </div>

            <div className="relative h-20 w-28 overflow-hidden rounded-2xl bg-white shadow-[inset_0_0_0_1px_rgba(15,23,42,0.06)]">
              <Image src={c.img} alt="Oferta" fill className="object-contain p-2" />
            </div>
          </div>
        ))}
      </div>

      {/* Sección tipo “Aceite / Fruta” (tarjetas grandes) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Card grande izquierda */}
        <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/55 p-6 shadow-[0_18px_55px_-35px_rgba(2,132,199,0.55)] ring-1 ring-slate-900/5 backdrop-blur transition hover:-translate-y-1 hover:bg-white/70 hover:shadow-[0_28px_80px_-45px_rgba(2,132,199,0.6)]">
          <h2 className="text-2xl font-bold">Aceite</h2>
          <p className="mt-2 text-slate-600">
            Productos esenciales para cocina y preparación diaria. Calidad y
            disponibilidad para tu operación.
          </p>

          <div className="relative mt-6 h-72 w-full overflow-hidden rounded-3xl bg-white shadow-[inset_0_0_0_1px_rgba(15,23,42,0.06)]">
            <Image
              src="/home/aceite.jpg"
              alt="Aceite"
              fill
              className="object-contain p-6"
            />
          </div>
        </div>

        {/* Card grande derecha */}
        <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/55 p-6 shadow-[0_18px_55px_-35px_rgba(2,132,199,0.55)] ring-1 ring-slate-900/5 backdrop-blur transition hover:-translate-y-1 hover:bg-white/70 hover:shadow-[0_28px_80px_-45px_rgba(2,132,199,0.6)]">
          <h2 className="text-2xl font-bold">Fruta</h2>
          <p className="mt-2 text-slate-600">
            Selección de productos para surtido y consumo. Mantén tu inventario
            al día con pedidos rápidos.
          </p>

          <div className="relative mt-6 h-72 w-full overflow-hidden rounded-3xl bg-white shadow-[inset_0_0_0_1px_rgba(15,23,42,0.06)]">
            <Image
              src="/home/shampoo.jpg"
              alt="Fruta"
              fill
              className="object-contain p-6"
            />
          </div>
        </div>
      </div>

      {/* Otra sección grande (Barra) */}
      <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/55 p-6 shadow-[0_18px_55px_-35px_rgba(2,132,199,0.55)] ring-1 ring-slate-900/5 backdrop-blur transition hover:-translate-y-1 hover:bg-white/70 hover:shadow-[0_28px_80px_-45px_rgba(2,132,199,0.6)]">
        <h2 className="text-2xl font-bold">Barra</h2>
        <p className="mt-2 text-slate-600">
          Productos para snacks y consumo rápido. Ideal para surtido de mostrador
          y pedidos frecuentes.
        </p>

        <div className="relative mt-6 h-80 w-full overflow-hidden rounded-3xl bg-white shadow-[inset_0_0_0_1px_rgba(15,23,42,0.06)]">
          <Image
            src="/home/barras.jpg"
            alt="Barra"
            fill
            className="object-contain p-6"
          />
        </div>
      </div>
    </section>
  )
}
