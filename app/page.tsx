import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  return (
    <section className="space-y-8">
      {/* HERO tipo mockup */}
      <div className="rounded-3xl border bg-sky-50 p-6 shadow-sm">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
          {/* Texto izquierda */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-slate-900">Bienvenido</h1>

            <p className="max-w-xl text-slate-600">
             neceito un texto de bienvenida para poder dar una descripcion
             en la pagina de lo que va enfocado al empresa o los producitos
              
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/productos"
                className="rounded-2xl border bg-white px-6 py-3 font-semibold shadow-sm hover:bg-slate-50"
              >
                Productos
              </Link>
              <Link
                href="/generar-pedido"
                className="rounded-2xl border bg-white px-6 py-3 font-semibold shadow-sm hover:bg-slate-50"
              >
                Generar pedido
              </Link>
              <Link
                href="/contacto"
                className="rounded-2xl border bg-white px-6 py-3 font-semibold shadow-sm hover:bg-slate-50"
              >
                Contacto
              </Link>
            </div>
          </div>

          {/* Imagen derecha */}
          <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-3xl bg-white p-4">
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

      {/* Mini carrusel / ofertas (3 tarjetas) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          { img: "/home/nutella.png", off: "20%", label: "producto", btn: "pedido" },
          { img: "/home/canasta.jpg", off: "20%", label: "producto", btn: "pedido" },
          { img: "/home/chocolate.png", off: "15%", label: "producto", btn: "pedido" },
        ].map((c, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between gap-4 rounded-3xl border bg-sky-50 p-5 shadow-sm"
          >
            <div className="space-y-2">
              <div className="text-sm text-slate-600">{c.label}</div>
              <div className="text-2xl font-bold">{c.off}</div>
              <span className="inline-flex rounded-full bg-white px-3 py-1 text-sm shadow-sm">
                {c.btn}
              </span>
            </div>

            <div className="relative h-20 w-28 overflow-hidden rounded-2xl bg-white">
              <Image src={c.img} alt="Oferta" fill className="object-contain p-2" />
            </div>
          </div>
        ))}
      </div>

      {/* Sección tipo “Aceite / Fruta / Barra” (tarjetas grandes) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Card grande izquierda */}
        <div className="rounded-3xl border bg-sky-50 p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Aceite</h2>
          <p className="mt-2 text-slate-600">
            Aquí va la descripción del producto/categoría como en el mockup.
          </p>

          <div className="relative mt-6 h-72 w-full overflow-hidden rounded-3xl bg-white">
            <Image
              src="/home/aceite.jpg"
              alt="Aceite"
              fill
              className="object-contain p-6"
            />
          </div>
        </div>

        {/* Card grande derecha */}
        <div className="rounded-3xl border bg-sky-50 p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Fruta</h2>
          <p className="mt-2 text-slate-600">
            Aquí va la descripción del producto/categoría como en el mockup.
          </p>

          <div className="relative mt-6 h-72 w-full overflow-hidden rounded-3xl bg-white">
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
      <div className="rounded-3xl border bg-sky-50 p-6 shadow-sm">
        <h2 className="text-2xl font-bold">Barra</h2>
        <p className="mt-2 text-slate-600">
          Aquí va la descripción del producto/categoría como en el mockup.
        </p>

        <div className="relative mt-6 h-80 w-full overflow-hidden rounded-3xl bg-white">
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
