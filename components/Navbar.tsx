"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

function cn(...s: Array<string | false | null | undefined>) {
  return s.filter(Boolean).join(" ")
}

function IconCart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M6.5 6h15l-1.6 8.2a2 2 0 0 1-2 1.6H9.1a2 2 0 0 1-2-1.7L5.4 3.8A1.5 1.5 0 0 0 3.9 2.5H2.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM17.5 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
        fill="currentColor"
      />
    </svg>
  )
}

function IconUser(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M20 21a8 8 0 0 0-16 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 13a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/productos", label: "Catálogo" },
  { href: "/contacto", label: "Contacto" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [q, setQ] = useState("")

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const glow = useMemo(
    () =>
      scrolled
        ? "bg-white/70 border-white/40 shadow-[0_16px_60px_-30px_rgba(15,23,42,.55)]"
        : "bg-white/55 border-white/30 shadow-[0_20px_70px_-40px_rgba(15,23,42,.45)]",
    [scrolled]
  )

  return (
    <header className="sticky top-0 z-50">
      {/* Soft neon background */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24">
        <div className="mx-auto h-full max-w-7xl px-4">
          <div className="relative h-full">
            <div className="absolute -left-20 -top-14 h-40 w-40 rounded-full bg-sky-300/25 blur-3xl" />
            <div className="absolute left-1/3 -top-16 h-44 w-44 rounded-full bg-fuchsia-300/20 blur-3xl" />
            <div className="absolute right-0 -top-14 h-40 w-40 rounded-full bg-emerald-300/20 blur-3xl" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-3">
        <motion.div
          layout
          className={cn(
            "relative flex items-center gap-3 rounded-2xl border backdrop-blur-xl",
            glow
          )}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {/* Animated border shimmer */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
          </div>

          {/* Brand */}
          <Link
            href="/"
            className="group flex items-center gap-3 px-4 py-3"
            aria-label="Operadora Balles"
          >
            <div className="relative h-10 w-10 overflow-hidden rounded-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-400 via-fuchsia-400 to-emerald-400" />
              <motion.div
                className="absolute inset-0 opacity-60"
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                style={{
                  background:
                    "conic-gradient(from 180deg, rgba(255,255,255,.0), rgba(255,255,255,.45), rgba(255,255,255,.0))",
                }}
              />
            </div>
            <div className="leading-tight">
              <div className="text-[11px] font-semibold tracking-widest text-slate-500">
                OPERADORA
              </div>
              <div className="text-sm font-bold tracking-wide text-slate-900">
                BALLES{" "}
                <span className="text-xs font-semibold text-slate-500">
                  • Neon
                </span>
              </div>
            </div>
          </Link>

          {/* Nav */}
          <nav className="hidden flex-1 items-center justify-center md:flex">
            <div className="flex items-center gap-2 rounded-full border border-white/40 bg-white/55 px-2 py-1 backdrop-blur">
              {navItems.map((it) => (
                <NavLink key={it.href} href={it.href} label={it.label} />
              ))}
            </div>
          </nav>

          {/* Search */}
          <div className="ml-auto flex items-center gap-2 pr-3">
            <div className="relative hidden w-[340px] md:block">
              <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M21 21l-4.3-4.3m1.8-5.2a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar..."
                className="w-full rounded-full border border-white/50 bg-white/70 px-10 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-200 focus:shadow-[0_0_0_4px_rgba(56,189,248,.15)]"
              />
              <AnimatePresence>
                {q?.length > 0 && (
                  <motion.button
                    type="button"
                    onClick={() => setQ("")}
                    className="absolute inset-y-0 right-2 my-auto rounded-full px-3 text-xs font-semibold text-slate-600 hover:bg-white/70"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                  >
                    Limpiar
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Actions */}
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
            >
              <Link
                href="/pedido"
                className="group relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/40 bg-white/60 backdrop-blur transition hover:bg-white/80"
                aria-label="Carrito"
              >
                <span className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(120px 60px at 50% 0%, rgba(56,189,248,.22), transparent 55%)",
                  }}
                />
                <IconCart className="h-5 w-5 text-slate-800" />
              </Link>

              <Link
                href="/login"
                className="group relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/40 bg-white/60 backdrop-blur transition hover:bg-white/80"
                aria-label="Usuario"
              >
                <span className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(120px 60px at 50% 0%, rgba(232,121,249,.18), transparent 55%)",
                  }}
                />
                <IconUser className="h-5 w-5 text-slate-800" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </header>
  )
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="relative rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:text-slate-900"
    >
      <span className="relative z-10">{label}</span>
      <motion.span
        className="absolute inset-x-2 -bottom-[2px] h-[2px] rounded-full bg-gradient-to-r from-sky-400 via-fuchsia-400 to-emerald-400 opacity-0"
        whileHover={{ opacity: 1, scaleX: 1 }}
        initial={{ scaleX: 0.6 }}
        transition={{ duration: 0.18 }}
      />
    </Link>
  )
}
