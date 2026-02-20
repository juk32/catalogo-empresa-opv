// app/layout.tsx
import "./globals.css"
import Image from "next/image"
import Providers from "./providers"
import SiteHeader from "@/components/SiteHeader"

export const metadata = {
  title: "Operadora Balles",
  description: "Catálogo de productos",
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
}

function SiteFooter() {
  return (
    <footer className="text-white">
      <div className="relative overflow-hidden">
        {/* fondo gradiente */}
        <div className="absolute inset-0 bg-gradient-to-r from-sky-600 via-indigo-600 to-rose-600" />
        {/* glows */}
        <div className="pointer-events-none absolute -top-24 left-10 h-80 w-80 rounded-full bg-white/15 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-24 right-10 h-80 w-80 rounded-full bg-white/10 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <div className="text-xl font-extrabold">Operado</div>
              <p className="mt-3 text-sm text-white/85">
                Catálogo interno para consultar productos, precios y generar pedidos de forma rápida.
              </p>

              <div className="mt-5 flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15">f</span>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15">in</span>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15">ig</span>
              </div>
            </div>

            <div>
              <div className="text-sm font-extrabold">Quick Links</div>
              <ul className="mt-4 space-y-2 text-sm text-white/85">
                <li>
                  <a className="hover:text-white" href="/productos">
                    Productos
                  </a>
                </li>
                <li>
                  <a className="hover:text-white" href="/pedido">
                    Generar pedido
                  </a>
                </li>
                <li>
                  <a className="hover:text-white" href="/pedidos">
                    Pedidos
                  </a>
                </li>
                <li>
                  <a className="hover:text-white" href="/contacto">
                    Contacto
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-sm font-extrabold">Address</div>
              <p className="mt-4 text-sm text-white/85">
                Hidalgo, México <br />
                Operadora Balles
              </p>
            </div>
          </div>

          <div className="mt-10 border-t border-white/20 pt-6 text-xs text-white/85">
            © {new Date().getFullYear()} Operadora Balles. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="overflow-x-hidden">
      {/* ✅ CLAVE: flex flex-col + main flex-1 para que el footer SIEMPRE se vea */}
      <body className="min-h-screen overflow-x-hidden antialiased text-slate-900 flex flex-col">
        <Providers>
          {/* Fondo global */}
          <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute inset-0 bg-white" />
            <div className="absolute -top-40 left-1/2 h-[520px] w-[980px] -translate-x-1/2 rounded-full bg-sky-300/25 blur-[120px]" />
            <div className="absolute top-16 left-10 h-[420px] w-[420px] rounded-full bg-indigo-300/14 blur-[130px]" />
            <div className="absolute top-24 right-10 h-[420px] w-[420px] rounded-full bg-sky-200/18 blur-[140px]" />
            <div className="absolute -bottom-56 left-8 h-[520px] w-[520px] rounded-full bg-rose-300/16 blur-[150px]" />
          </div>

          <SiteHeader />

          {/* ✅ main crece y empuja el footer abajo */}
          <main className="mx-auto w-full max-w-7xl px-4 py-8 overflow-x-clip flex-1">
            {children}
          </main>

          {/* WhatsApp */}
          <a
            href="https://wa.me/5217715565797"
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            className="fixed bottom-5 right-5 z-50 transition hover:-translate-y-1"
          >
            <div className="relative h-16 w-16 rounded-full bg-white/80 backdrop-blur shadow-[0_20px_45px_-20px_rgba(0,0,0,0.25)] hover:shadow-[0_28px_65px_-25px_rgba(0,0,0,0.35)]">
              <Image src="/icons/whatsapp.png" alt="WhatsApp" fill className="object-contain" priority />
            </div>
          </a>

          <SiteFooter />
        </Providers>
      </body>
    </html>
  )
}