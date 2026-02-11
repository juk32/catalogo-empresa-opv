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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="min-h-screen text-slate-900">
        <Providers>
          {/* ✅ Header (sticky solo en Home lo controla SiteHeader) */}
          <SiteHeader />

          {/* ✅ Animación suave al entrar a cada página */}
          <main className="page-in mx-auto max-w-6xl px-4 py-8">
            {children}
          </main>

          {/* WhatsApp flotante */}
          <a
            href="https://wa.me/5217715565797"
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            className="fixed bottom-5 right-5 z-50 transition hover:-translate-y-1"
          >
            <div className="relative h-16 w-16 rounded-full shadow-[0_20px_45px_-20px_rgba(0,0,0,0.45)] hover:shadow-[0_28px_65px_-25px_rgba(0,0,0,0.55)]">
              <Image
                src="/icons/whatsapp.png"
                alt="WhatsApp"
                fill
                className="object-contain"
                priority
              />
            </div>
          </a>

          <footer className="mt-16 border-t border-white/40 bg-white/40 backdrop-blur">
            <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-700">
              Operadora Balles • Tlapacoya, Hidalgo
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  )
}
