import "./globals.css"
import Link from "next/link"
import { ShoppingCart, User, Search } from "lucide-react"

export const metadata = {
  title: "Operadora Balles",
  description: "Catálogo de productos",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-slate-50 text-slate-900">
        <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex items-center justify-between gap-3 py-3">
              {/* Logo + nombre */}
              <Link href="/" className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-sky-600" />
                <div className="leading-tight">
                  <div className="text-xs text-slate-500">OPERADORA</div>
                  <div className="font-bold tracking-wide">BALLES</div>
                </div>
              </Link>

              {/* Menu */}
              <nav className="hidden md:flex items-center gap-5 text-sm">
                <Link className="hover:text-sky-700" href="/">Inicio</Link>
                <Link className="hover:text-sky-700" href="/productos">Productos</Link>
                <Link className="hover:text-sky-700" href="/generar-pedido">Generar Pedido</Link>
                <Link className="hover:text-sky-700" href="/contacto">Contacto</Link>
                <Link className="hover:text-sky-700" href="/accesorios">Accesorios</Link>
              </nav>

              {/* Search + icons */}
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 rounded-xl border bg-white px-3 py-2">
                  <Search size={18} className="text-slate-500" />
                  <input
                    className="w-56 outline-none text-sm"
                    placeholder="Buscar…"
                  />
                </div>

                <Link
                  href="/generar-pedido"
                  className="rounded-xl border bg-white p-2 hover:bg-slate-50"
                  aria-label="Carrito"
                  title="Carrito"
                >
                  <ShoppingCart size={20} />
                </Link>

                <Link
                  href="#"
                  className="rounded-xl border bg-white p-2 hover:bg-slate-50"
                  aria-label="Usuario"
                  title="Usuario"
                >
                  <User size={20} />
                </Link>
              </div>
            </div>

            {/* Menu móvil */}
            <div className="md:hidden pb-3 flex gap-3 text-sm overflow-x-auto">
              <Link className="whitespace-nowrap hover:text-sky-700" href="/">Inicio</Link>
              <Link className="whitespace-nowrap hover:text-sky-700" href="/productos">Productos</Link>
              <Link className="whitespace-nowrap hover:text-sky-700" href="/generar-pedido">Generar Pedido</Link>
              <Link className="whitespace-nowrap hover:text-sky-700" href="/contacto">Contacto</Link>
              <Link className="whitespace-nowrap hover:text-sky-700" href="/accesorios">Accesorios</Link>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>

        {/* WhatsApp flotante */}
        <a
          href="https://wa.me/525629782285"
          target="_blank"
          className="fixed bottom-5 right-5 rounded-full bg-green-500 px-4 py-3 text-white shadow-lg hover:brightness-95"
          aria-label="WhatsApp"
        >
          WhatsApp
        </a>

        <footer className="mt-16 border-t bg-white">
          <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-600">
            Operadora Balles • Tlapacoya, Hidalgo
          </div>
        </footer>
      </body>
    </html>
  )
}
