"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMemo, useState } from "react"

function cx(...s: Array<string | false | null | undefined>) {
  return s.filter(Boolean).join(" ")
}

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const links = useMemo(
    () => [
      { href: "/", label: "Inicio" },
      { href: "/productos", label: "Catálogo" },
      { href: "/generar-pedido", label: "Generar Pedido" },
      { href: "/contacto", label: "Contacto" },
      { href: "/carrito", label: "Carrito" },
    ],
    []
  )

  function isActive(href: string) {
    if (href === "/") return pathname === "/"
    return pathname?.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50">
      {/* Glow detrás del navbar (azul + rojo) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-24">
        <div className="absolute left-1/2 top-0 h-24 w-[980px] -translate-x-1/2 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute right-8 top-2 h-24 w-72 rounded-full bg-rose-300/18 blur-3xl" />
      </div>

      <div className="border-b border-white/45 bg-white/60 backdrop-blur-xl shadow-[0_18px_45px_-35px_rgba(2,6,23,0.35)]">
        {/* Línea neon animada superior */}
        <div className="h-[2px] w-full neon-topline" />

        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-2xl bg-gradient-to-br from-sky-500 via-indigo-600 to-rose-500 shadow-[0_18px_40px_-24px_rgba(244,63,94,0.55)]">
              <div className="absolute inset-0 rounded-2xl ring-1 ring-white/50" />
            </div>

            <div className="leading-tight">
              <div className="text-xs font-semibold tracking-wide text-slate-600">OPERADORA</div>
              <div className="text-sm font-black tracking-wide text-slate-900">
                BALLES{" "}
                <span className="ml-1 text-[10px] font-semibold text-slate-500 group-hover:text-rose-500 transition">
                  • Neon
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 rounded-2xl border border-white/55 bg-white/55 px-2 py-2 shadow-sm backdrop-blur relative">
            {/* borde neon animado sutil */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl neon-border" />

            {links.map((l) => {
              const active = isActive(l.href)
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cx(
                    "relative rounded-xl px-3 py-2 text-sm font-semibold transition",
                    active
                      ? "text-white bg-slate-900 shadow-[0_14px_30px_-18px_rgba(0,0,0,.55)]"
                      : "text-slate-800 hover:bg-white/70"
                  )}
                >
                  {l.label}

                  {/* underline neon si activo */}
                  {active ? (
                    <span className="pointer-events-none absolute left-2 right-2 -bottom-[6px] h-[2px] rounded-full neon-underline" />
                  ) : null}
                </Link>
              )
            })}
          </nav>

          {/* Right tools */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 rounded-2xl border border-white/55 bg-white/55 px-3 py-2 backdrop-blur relative shadow-sm search-wrap">
              <span className="text-slate-400">🔎</span>
              <input
                placeholder="Buscar…"
                className="w-56 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-500"
              />
              <span className="pointer-events-none search-glow" />
            </div>

            {/* Icons */}
            <Link
              href="/carrito"
              className="icon-neon grid h-10 w-10 place-items-center rounded-2xl border border-white/55 bg-white/55 text-slate-900 backdrop-blur transition"
              aria-label="Carrito"
              title="Carrito"
            >
              🛒
            </Link>

            <Link
              href="/login"
              className="icon-neon grid h-10 w-10 place-items-center rounded-2xl border border-white/55 bg-white/55 text-slate-900 backdrop-blur transition"
              aria-label="Usuario"
              title="Usuario"
            >
              👤
            </Link>

            {/* Mobile button */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden icon-neon grid h-10 w-10 place-items-center rounded-2xl border border-white/55 bg-white/55 text-slate-900 backdrop-blur transition"
              aria-label="Menú"
            >
              {open ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden border-t border-white/45 bg-white/55 backdrop-blur-xl">
            <div className="mx-auto max-w-6xl px-4 py-3 space-y-2">
              <div className="relative flex items-center gap-2 rounded-2xl border border-white/55 bg-white/55 px-3 py-2 shadow-sm search-wrap">
                <span className="text-slate-400">🔎</span>
                <input
                  placeholder="Buscar…"
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-500"
                />
                <span className="pointer-events-none search-glow" />
              </div>

              <div className="grid gap-2">
                {links.map((l) => {
                  const active = isActive(l.href)
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={cx(
                        "relative rounded-2xl border border-white/55 bg-white/55 px-4 py-3 text-sm font-semibold text-slate-900 backdrop-blur transition hover:bg-white/70",
                        active && "bg-slate-900 text-white border-slate-900"
                      )}
                    >
                      {l.label}
                      {active ? (
                        <span className="pointer-events-none absolute inset-x-4 bottom-2 h-[2px] rounded-full neon-underline" />
                      ) : null}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CSS local (neon + anim) */}
      <style>{`
        /* Top line animada (cyan -> indigo -> red) */
        .neon-topline{
          background: linear-gradient(90deg,
            rgba(56,189,248,.55),
            rgba(99,102,241,.25),
            rgba(244,63,94,.45),
            rgba(56,189,248,.55)
          );
          background-size: 200% 200%;
          animation: neonShift 4.6s ease-in-out infinite;
          filter: drop-shadow(0 10px 18px rgba(244,63,94,.18));
        }

        /* Border animado del nav */
        .neon-border{
          border-radius: 16px;
          padding: 1px;
          background: conic-gradient(from 180deg,
            rgba(56,189,248,.45),
            rgba(99,102,241,.22),
            rgba(244,63,94,.38),
            rgba(56,189,248,.45)
          );
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: .55;
          animation: neonSpin 8s linear infinite;
        }

        /* underline neon */
        .neon-underline{
          background: linear-gradient(90deg,
            rgba(56,189,248,.9),
            rgba(99,102,241,.6),
            rgba(244,63,94,.9)
          );
          background-size: 200% 200%;
          animation: neonShift 3.4s ease-in-out infinite;
          box-shadow: 0 12px 28px -18px rgba(244,63,94,.55);
        }

        @keyframes neonShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes neonSpin {
          to { transform: rotate(360deg); }
        }

        /* Search glow al focus */
        .search-wrap{ position: relative; }
        .search-glow{
          position: absolute;
          inset: -2px;
          border-radius: 18px;
          opacity: 0;
          transition: opacity 180ms ease;
          background:
            radial-gradient(140px 60px at 28% 50%, rgba(56,189,248,.35), transparent 65%),
            radial-gradient(140px 60px at 78% 50%, rgba(244,63,94,.30), transparent 65%);
          filter: blur(10px);
          z-index: -1;
        }
        .search-wrap:focus-within .search-glow{
          opacity: 1;
        }

        /* Icons hover neon */
        .icon-neon{
          transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease, border-color 160ms ease;
        }
        .icon-neon:hover{
          transform: translateY(-1px);
          background: rgba(255,255,255,.72);
          border-color: rgba(226,232,240,.9);
          box-shadow:
            0 18px 40px -28px rgba(2,6,23,.35),
            0 14px 30px -26px rgba(244,63,94,.22);
        }

        @media (prefers-reduced-motion: reduce) {
          .neon-topline, .neon-border, .neon-underline { animation: none !important; }
        }
      `}</style>
    </header>
  )
}
