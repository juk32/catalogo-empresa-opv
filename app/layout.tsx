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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="overflow-x-hidden">
      <body className="min-h-screen text-slate-900 overflow-x-hidden antialiased">
        <Providers>
          {/* Fondo global */}
          <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute inset-0 bg-white" />
            <div className="absolute -top-40 left-1/2 h-[520px] w-[980px] -translate-x-1/2 rounded-full bg-sky-300/25 blur-[120px]" />
            <div className="absolute top-16 left-10 h-[420px] w-[420px] rounded-full bg-indigo-300/14 blur-[130px]" />
            <div className="absolute top-24 right-10 h-[420px] w-[420px] rounded-full bg-sky-200/18 blur-[140px]" />
          </div>

          <SiteHeader />

          {/* ✅ CLAVE: overflow-x-clip evita “azul a la derecha” por sliders */}
          <main className="mx-auto w-full max-w-7xl px-4 py-8 overflow-x-clip">
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

          <footer className="mt-16 border-t border-slate-200/60 bg-white/60 backdrop-blur">
            <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-slate-700">
              Operadora Balles • Tlapacoya, Hidalgo
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  )
}
