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
      <div className="border-b border-white/40 bg-white/55 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 shadow-[0_16px_34px_-20px_rgba(0,0,0,.9)]" />
            <div className="leading-tight">
              <div className="text-xs font-semibold tracking-wide text-slate-600">OPERADORA</div>
              <div className="text-sm font-black tracking-wide text-slate-900">BALLES</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 rounded-2xl border border-white/45 bg-white/55 px-2 py-2 shadow-sm backdrop-blur">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cx(
                  "rounded-xl px-3 py-2 text-sm font-semibold transition",
                  isActive(l.href)
                    ? "bg-slate-900 text-white shadow-[0_12px_24px_-18px_rgba(0,0,0,.9)]"
                    : "text-slate-800 hover:bg-white/70"
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right tools */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 rounded-2xl border border-white/45 bg-white/55 px-3 py-2 backdrop-blur">
              <span className="text-slate-400">🔎</span>
              <input
                placeholder="Buscar…"
                className="w-56 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-500"
              />
            </div>

            {/* Icons */}
            <Link
              href="/carrito"
              className="grid h-10 w-10 place-items-center rounded-2xl border border-white/45 bg-white/55 text-slate-900 backdrop-blur transition hover:bg-white/70"
              aria-label="Carrito"
              title="Carrito"
            >
              🛒
            </Link>
            <Link
              href="/login"
              className="grid h-10 w-10 place-items-center rounded-2xl border border-white/45 bg-white/55 text-slate-900 backdrop-blur transition hover:bg-white/70"
              aria-label="Usuario"
              title="Usuario"
            >
              👤
            </Link>

            {/* Mobile button */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden grid h-10 w-10 place-items-center rounded-2xl border border-white/45 bg-white/55 text-slate-900 backdrop-blur transition hover:bg-white/70"
              aria-label="Menú"
            >
              {open ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden border-t border-white/40 bg-white/50 backdrop-blur-xl">
            <div className="mx-auto max-w-6xl px-4 py-3 space-y-2">
              <div className="flex items-center gap-2 rounded-2xl border border-white/45 bg-white/55 px-3 py-2">
                <span className="text-slate-400">🔎</span>
                <input
                  placeholder="Buscar…"
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-500"
                />
              </div>

              <div className="grid gap-2">
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={cx(
                      "rounded-2xl border border-white/45 bg-white/55 px-4 py-3 text-sm font-semibold text-slate-900 backdrop-blur transition hover:bg-white/70",
                      isActive(l.href) && "bg-slate-900 text-white border-slate-900"
                    )}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
