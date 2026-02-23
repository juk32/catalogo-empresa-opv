"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import dynamic from "next/dynamic"
import { useEffect, useMemo, useState } from "react"
import { Menu, X, ShoppingCart, Search, ArrowRight, User } from "lucide-react"

// ✅ NO SSR para evitar window/doc en server
const UserMenu = dynamic(() => import("@/components/UserMenu"), { ssr: false })

function cx(...s: Array<string | false | null | undefined>) {
  return s.filter(Boolean).join(" ")
}

type NavItem = { label: string; href: string }

export default function SiteHeader() {
  const pathname = usePathname()
  if (pathname === "/login") return null

  const nav: NavItem[] = useMemo(
    () => [
      { label: "Inicio", href: "/" },
      { label: "Nosotros", href: "/nosotros" },
      { label: "Catálogo", href: "/productos" },
      { label: "Contacto", href: "/contacto" },
    ],
    []
  )

  function isActive(href: string) {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(href + "/")
  }

  const [open, setOpen] = useState(false)
  useEffect(() => setOpen(false), [pathname])

  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cx(
        "sticky top-0 z-50 w-full",
        "bg-white/85 backdrop-blur-xl",
        "border-b border-slate-200/70"
      )}
    >
      {/* Glow rojo sutil (clean, pero con vibe) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-20">
        <div className="absolute left-1/2 top-0 h-20 w-[980px] -translate-x-1/2 rounded-full bg-rose-300/25 blur-3xl" />
        <div className="absolute right-10 top-2 h-20 w-72 rounded-full bg-red-300/15 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4">
        <div className="relative flex h-16 items-center">
          {/* Left: Brand */}
          <Link href="/" className="flex items-center gap-2 rounded-xl px-2 py-1 transition hover:bg-slate-50">
            <div
              className={cx(
                "relative grid h-9 w-9 place-items-center rounded-2xl",
                "bg-gradient-to-br from-rose-500 via-red-600 to-rose-700",
                // 3D look
                "shadow-[0_18px_30px_-14px_rgba(244,63,94,0.55),0_10px_18px_-14px_rgba(2,6,23,0.35)]"
              )}
            >
              <span className="relative z-10 text-sm font-black text-white">OB</span>
              {/* highlight */}
              <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/40" />
              <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/25 to-transparent" />
            </div>

            <div className="leading-tight">
              <div className="text-[11px] tracking-widest text-slate-500">OPERADORA</div>
              <div className="text-[15px] font-semibold text-slate-900">BALLES</div>
            </div>
          </Link>

          {/* Center: Desktop nav */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 md:flex">
            {nav.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cx(
                    "relative text-[13px] font-medium transition",
                    active ? "text-slate-900" : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={cx(
                      "absolute -bottom-2 left-0 h-[2px] w-full rounded-full transition-opacity",
                      active ? "opacity-100 bg-red-600" : "opacity-0 bg-red-600"
                    )}
                  />
                </Link>
              )
            })}
          </nav>

          <div className="flex-1" />

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Search (desktop only) */}
            <div className="hidden lg:flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
              <Search size={16} className="text-slate-500" />
              <input
                className="w-44 bg-transparent text-sm outline-none placeholder:text-slate-400"
                placeholder="Buscar…"
              />
            </div>

            {/* Carrito (neutral) */}
            <Link
              href="/carrito"
              className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-50"
              aria-label="Carrito"
              title="Carrito"
            >
              <ShoppingCart size={18} className="mr-2" />
              <span className="hidden sm:inline">Carrito</span>
            </Link>

            {/* Cuenta (desktop) */}
            <div className="hidden sm:block rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium shadow-sm transition hover:bg-slate-50">
              <UserMenu />
            </div>

            {/* Mobile toggle */}
            <button
              type="button"
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition hover:bg-slate-50"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile: sheet rojo 3D / glass */}
      <div className={cx("md:hidden", open ? "block" : "hidden")}>
        {/* overlay */}
        <button
          aria-label="Cerrar"
          className="fixed inset-0 z-40 bg-slate-900/25 backdrop-blur-[2px]"
          onClick={() => setOpen(false)}
        />

        {/* sheet */}
        <div className="fixed left-0 right-0 top-16 z-50 mx-auto w-[min(760px,100%)] px-4 animate-in slide-in-from-top-2 duration-200">
          <div
            className={cx(
              "relative overflow-hidden rounded-[28px]",
              "border border-white/60 bg-white/82 backdrop-blur-xl",
              "shadow-[0_40px_90px_-45px_rgba(2,6,23,0.55),0_0_0_1px_rgba(255,255,255,0.35)]"
            )}
          >
            {/* top red neon line */}
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-red-500/75 to-transparent" />

            {/* red glow blobs */}
            <div className="pointer-events-none absolute -top-16 left-1/2 h-44 w-[520px] -translate-x-1/2 rounded-full bg-red-400/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 right-6 h-44 w-64 rounded-full bg-rose-400/18 blur-3xl" />

            <div className="relative p-4 space-y-3">
              {/* Search mobile */}
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-3 py-3 shadow-sm">
                <Search size={18} className="text-slate-500" />
                <input className="w-full bg-transparent text-sm outline-none" placeholder="Buscar productos…" />
              </div>

              {/* CTAs (bonito 3D) */}
              <div className="grid grid-cols-2 gap-2">
                {/* Botón rojo principal */}
                <Link
                  href="/productos"
                  className={cx(
                    "col-span-2",
                    "group relative overflow-hidden rounded-2xl px-4 py-3 text-sm font-semibold text-white",
                    "bg-gradient-to-b from-red-500 via-red-600 to-rose-700",
                    "shadow-[0_18px_28px_-14px_rgba(244,63,94,0.65),0_10px_18px_-16px_rgba(2,6,23,0.45)]",
                    "active:scale-[0.99] transition"
                  )}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Ver Catálogo <ArrowRight size={18} className="transition group-hover:translate-x-0.5" />
                  </span>
                  {/* shine */}
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/25 to-transparent" />
                  <span className="pointer-events-none absolute -left-10 top-0 h-full w-24 rotate-12 bg-white/20 blur-xl opacity-70" />
                </Link>

                {/* Carrito */}
                <Link
                  href="/carrito"
                  className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/90 py-3 text-sm font-semibold shadow-sm transition hover:bg-white active:scale-[0.99]"
                >
                  <ShoppingCart size={18} />
                  Carrito
                </Link>

                {/* Cuenta */}
                <button
                  type="button"
                  onClick={() => {
                    // solo cerramos y dejas que el UserMenu maneje su propio UI
                    setOpen(false)
                    // si quieres, aquí puedes navegar a /cuenta si tienes esa ruta
                  }}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/90 py-3 text-sm font-semibold shadow-sm transition hover:bg-white active:scale-[0.99]"
                >
                  <User size={18} />
                  Cuenta
                </button>
              </div>

              {/* Nav items */}
              <div className="grid gap-1">
                {nav.map((item) => {
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cx(
                        "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition",
                        "border border-slate-200 shadow-sm",
                        active
                          ? "bg-gradient-to-b from-red-500 via-red-600 to-rose-700 text-white"
                          : "bg-white/90 text-slate-800 hover:bg-white"
                      )}
                    >
                      <span>{item.label}</span>
                      <span className={cx("text-xs", active ? "opacity-90" : "text-slate-400")}>Ir</span>
                    </Link>
                  )
                })}
              </div>

              {/* UserMenu inside mobile sheet (bonito) */}
              <div className="rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-sm">
                <div className="text-xs font-semibold text-slate-500 mb-1">Mi cuenta</div>
                <UserMenu />
              </div>
            </div>

            {/* bottom soft line */}
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-rose-400/45 to-transparent" />
          </div>
        </div>
      </div>

      {/* shadow when scrolled */}
      <div
        className={cx(
          "pointer-events-none absolute inset-x-0 bottom-0 h-6 -z-10 transition-opacity",
          scrolled ? "opacity-100" : "opacity-0"
        )}
        style={{ boxShadow: "0 12px 28px -22px rgba(2,6,23,0.45)" }}
      />
    </header>
  )
}