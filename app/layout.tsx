// app/layout.tsx
import "./globals.css"
import Image from "next/image"
import Providers from "./providers"
import SiteHeader from "@/components/SiteHeader"
import FooterGate from "@/components/FooterGate"

export const metadata = {
  title: "Operadora Balles",
  description: "Catálogo de productos",
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
}

/* =========================
   Footer rojizo + animación (CSS only)
   ✅ Sin event handlers
========================= */
function SiteFooter() {
  return (
    <footer className="relative mt-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="relative overflow-hidden rounded-t-[48px] border border-rose-200/70 bg-white/80 backdrop-blur-xl shadow-[0_-30px_80px_-50px_rgba(2,6,23,0.35)] footer-enter">
          {/* Top neon line rojiza */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-rose-500/80 to-transparent" />

          {/* Animated blobs (rojizos) */}
          <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[920px] -translate-x-1/2 rounded-full bg-rose-400/25 blur-3xl footer-blob-a" />
          <div className="pointer-events-none absolute -top-10 right-16 h-40 w-80 rounded-full bg-red-400/18 blur-3xl footer-blob-b" />
          <div className="pointer-events-none absolute -bottom-24 left-10 h-52 w-96 rounded-full bg-fuchsia-400/14 blur-3xl footer-blob-c" />

          {/* Shimmer sweep */}
          <div className="pointer-events-none absolute inset-0 footer-sweep opacity-60" />

          <div className="relative px-8 py-6">
            <div className="grid gap-6 md:grid-cols-12">
              {/* Izquierda */}
              <div className="md:col-span-6">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-rose-500 via-red-600 to-rose-700 text-white font-black shadow-[0_18px_30px_-14px_rgba(244,63,94,0.60),0_10px_18px_-16px_rgba(2,6,23,0.35)]">
                    OB
                  </div>
                  <div className="leading-tight">
                    <div className="text-[11px] tracking-widest text-slate-500">OPERADORA</div>
                    <div className="text-[16px] font-extrabold text-slate-900">BALLES</div>
                  </div>
                </div>

                <p className="mt-3 text-sm text-slate-600 max-w-md">
                  Catálogo interno para consultar productos, precios y generar pedidos de forma rápida.
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-6 text-sm text-slate-700">
                  <a href="tel:+527714582134" className="hover:underline underline-offset-4">
                    +52 45-4582-1314
                  </a>
                  <a href="mailto:example@outlook.com" className="hover:underline underline-offset-4">
                    example@outlook.com
                  </a>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  {["f", "in", "ig"].map((s) => (
                    <a
                      key={s}
                      href="#"
                      className="grid h-9 w-9 place-items-center rounded-full bg-white/75 ring-1 ring-rose-200/70 shadow-sm hover:bg-white transition"
                      aria-label={s}
                    >
                      <span className="text-xs font-semibold text-slate-700">{s}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Derecha */}
              <div className="md:col-span-5 md:col-start-8">
                <div className="text-sm font-semibold text-slate-900">Newsletter</div>
                <p className="mt-2 text-sm text-slate-600">
                  Recibe actualizaciones y novedades del catálogo.
                </p>

                {/* ✅ Sin onSubmit */}
                <form
                  action="#"
                  method="GET"
                  className="mt-3 flex items-center overflow-hidden rounded-full border border-slate-200 bg-white/90 shadow-sm"
                >
                  <input
                    type="email"
                    name="email"
                    placeholder="Tu email"
                    className="h-10 flex-1 px-4 text-sm outline-none placeholder:text-slate-400 bg-transparent"
                  />
                  <button
                    type="submit"
                    className="h-10 px-5 text-sm font-semibold text-white bg-gradient-to-b from-rose-500 via-red-600 to-rose-700 shadow-[0_16px_26px_-18px_rgba(244,63,94,0.75)] hover:opacity-95 transition"
                  >
                    Send
                  </button>
                </form>

                <div className="mt-4 flex items-center gap-3">
                  {["wa", "ig", "f", "yt"].map((s) => (
                    <a
                      key={s}
                      href="#"
                      className="grid h-9 w-9 place-items-center rounded-full bg-white/75 ring-1 ring-rose-200/70 shadow-sm hover:bg-white transition"
                      aria-label={s}
                    >
                      <span className="text-xs font-semibold text-slate-700">{s}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Barra inferior */}
            <div className="mt-6 border-t border-slate-200/80 pt-4 text-xs text-slate-500 flex flex-col gap-2 md:flex-row md:justify-between">
              <span>© {new Date().getFullYear()} Operadora Balles</span>
              <div className="flex gap-4">
                <a href="/privacidad" className="hover:text-slate-900 hover:underline underline-offset-4">
                  Privacidad
                </a>
                <a href="/terminos" className="hover:text-slate-900 hover:underline underline-offset-4">
                  Términos
                </a>
              </div>
            </div>
          </div>

          {/* Bottom soft line */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-rose-400/45 to-transparent" />
        </div>
      </div>
    </footer>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="w-full max-w-[100vw] overflow-x-hidden overscroll-x-none">
      <body className="min-h-screen w-full max-w-[100vw] overflow-x-hidden overscroll-x-none antialiased text-slate-900 flex flex-col">
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

          <main className="mx-auto w-full max-w-7xl min-w-0 flex-1 px-4 py-8 overflow-x-clip">
            {children}
          </main>

          <FooterGate>
            {/* WhatsApp */}
            <a
              href="https://wa.me/5217715565797"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="fixed bottom-5 right-5 z-50 transition hover:-translate-y-1"
            >
              <div className="relative h-16 w-16 rounded-full bg-white/90 backdrop-blur shadow-[0_20px_45px_-20px_rgba(0,0,0,0.25)] hover:shadow-[0_28px_65px_-25px_rgba(0,0,0,0.35)]">
                <Image src="/icons/whatsapp.png" alt="WhatsApp" fill className="object-contain" priority />
              </div>
            </a>

            <SiteFooter />
          </FooterGate>
        </Providers>
      </body>
    </html>
  )
}