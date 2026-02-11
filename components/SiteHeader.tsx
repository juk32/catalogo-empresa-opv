"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, Search } from "lucide-react"
import UserMenu from "@/components/UserMenu"
import { useEffect, useMemo, useState } from "react"

function cx(...s: Array<string | false | null | undefined>) {
  return s.filter(Boolean).join(" ")
}

type NavItem = { label: string; href: string }

export default function SiteHeader() {
  const pathname = usePathname()
  const isHome = pathname === "/"

  // ✅ Compactar al hacer scroll (solo Home)
  const [compact, setCompact] = useState(false)
  useEffect(() => {
    if (!isHome) return
    const onScroll = () => setCompact(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [isHome])

  const nav: NavItem[] = useMemo(
    () => [
      { label: "Inicio", href: "/" },
      { label: "Nosotros", href: "/nosotros" },
      { label: "Catalogo", href: "/productos" },
      { label: "Contacto", href: "/contacto" },
    ],
    []
  )

  function isActive(href: string) {
    if (href === "/") return pathname === "/"
    // activa también subrutas (ej: /productos/123)
    return pathname === href || pathname.startsWith(href + "/")
  }

  const itemBase =
    "group relative rounded-xl px-3 py-2 text-sm font-semibold transition " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/80"

  const neon =
    "hover:text-sky-900 active:text-sky-950 " +
    "hover:bg-sky-500/15 active:bg-sky-500/20 " +
    "hover:shadow-[0_0_30px_rgba(56,189,248,.60)] active:shadow-[0_0_30px_rgba(56,189,248,.60)] " +
    "hover:ring-1 hover:ring-sky-300/70 active:ring-1 active:ring-sky-300/80"

  const activeStyle =
    "text-sky-950 bg-sky-500/15 ring-1 ring-sky-300/70 shadow-[0_0_30px_rgba(56,189,248,.55)]"

  return (
    <header className={cx(isHome && "sticky top-0", "z-50")}>
      <div
        className={cx(
          "border-b border-white/40 bg-white/60 backdrop-blur-xl transition-all",
          isHome && compact ? "py-1" : "py-0"
        )}
      >
        <div className="mx-auto max-w-6xl px-4">
          {/* TOP ROW */}
          <div className={cx("flex items-center justify-between gap-3", isHome && compact ? "py-2" : "py-3")}>
            {/* LOGO */}
            <Link href="/" className="flex items-center gap-2">
              <div
                className={cx(
                  "rounded-xl bg-sky-600 transition-all",
                  isHome && compact ? "h-8 w-8" : "h-9 w-9"
                )}
              />
              <div className="leading-tight">
                <div className="text-xs text-slate-500">OPERADORA</div>
                <div className="font-bold tracking-wide">BALLES</div>
              </div>
            </Link>

            {/* MENU DESKTOP */}
            <nav className="hidden md:flex items-center gap-2">
              {nav.map((x) => {
                const active = isActive(x.href)
                return (
                  <Link
                    key={x.href}
                    href={x.href}
                    className={cx(itemBase, neon, active && activeStyle)}
                  >
                    <span className="relative z-10">{x.label}</span>

                    {/* ✅ Subrayado animado */}
                    <span
                      className={cx(
                        "pointer-events-none absolute left-3 right-3 -bottom-0.5 h-[2px] rounded-full",
                        "bg-gradient-to-r from-sky-400 via-sky-500 to-indigo-500",
                        "opacity-0 scale-x-75 transition",
                        active ? "opacity-100 scale-x-100" : "group-hover:opacity-100 group-hover:scale-x-100"
                      )}
                    />
                  </Link>
                )
              })}
            </nav>

            {/* DERECHA */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <div
                className={cx(
                  "hidden sm:flex items-center gap-2 rounded-xl border border-white/45 bg-white/55 px-3 py-2 backdrop-blur transition",
                  "focus-within:ring-1 focus-within:ring-sky-300/80 focus-within:shadow-[0_0_28px_rgba(56,189,248,.45)]"
                )}
              >
                <Search size={18} className="text-slate-500" />
                <input className="w-40 bg-transparent outline-none text-sm" placeholder="Buscar…" />
              </div>

              {/* Carrito */}
              <Link
                href="/carrito"
                className={cx(
                  "relative grid h-10 w-10 place-items-center rounded-xl border border-white/45 bg-white/55 backdrop-blur transition",
                  neon
                )}
                aria-label="Carrito"
                title="Carrito"
              >
                <span className="relative z-10">
                  <ShoppingCart size={20} />
                </span>
                {/* aura sin bloquear clicks */}
                <span className="pointer-events-none absolute inset-[-10px] rounded-[inherit] opacity-0 blur-[12px] transition group-hover:opacity-100" />
              </Link>

              {/* Usuario */}
              <div className={cx("relative rounded-xl border border-white/45 bg-white/55 backdrop-blur", neon)}>
                <div className="relative z-10">
                  <UserMenu />
                </div>
              </div>
            </div>
          </div>

          {/* MENU MOVIL */}
          <div className="md:hidden pb-3 flex gap-2 overflow-x-auto whitespace-nowrap pr-1">
            {nav.map((x) => {
              const active = isActive(x.href)
              return (
                <Link
                  key={x.href}
                  href={x.href}
                  className={cx(
                    "rounded-full border border-white/45 bg-white/55 px-4 py-2 text-xs font-semibold backdrop-blur transition",
                    neon,
                    active && "bg-sky-500/15 ring-1 ring-sky-300/70 shadow-[0_0_25px_rgba(56,189,248,.55)]"
                  )}
                >
                  {x.label}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </header>
  )
}
