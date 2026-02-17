"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, Search } from "lucide-react"
import dynamic from "next/dynamic"
import { useEffect, useMemo, useRef, useState } from "react"

// ✅ NO SSR para evitar window/doc en server
const UserMenu = dynamic(() => import("@/components/UserMenu"), { ssr: false })

function cx(...s: Array<string | false | null | undefined>) {
  return s.filter(Boolean).join(" ")
}

type NavItem = { label: string; href: string }

export default function SiteHeader() {
  const pathname = usePathname()
  const isHome = pathname === "/"

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
    return pathname === href || pathname.startsWith(href + "/")
  }

  const navRef = useRef<HTMLDivElement | null>(null)
  const [pill, setPill] = useState<{ x: number; w: number; o: number }>({ x: 0, w: 0, o: 0 })

  function updatePill() {
    const root = navRef.current
    if (!root) return
    const activeEl = root.querySelector<HTMLAnchorElement>('a[data-active="true"]')
    if (!activeEl) return
    const rootRect = root.getBoundingClientRect()
    const elRect = activeEl.getBoundingClientRect()
    setPill({ x: elRect.left - rootRect.left, w: elRect.width, o: 1 })
  }

  useEffect(() => {
    const t = window.setTimeout(updatePill, 0)
    const onResize = () => updatePill()
    window.addEventListener("resize", onResize)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener("resize", onResize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    updatePill()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const itemBase =
    "relative rounded-xl px-3 py-2 text-sm font-semibold transition " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/80"

  const neonHoverSoft =
    "hover:bg-white/70 active:bg-white/75 " +
    "hover:ring-1 hover:ring-sky-300/60 " +
    "hover:shadow-[0_0_22px_rgba(56,189,248,.30),0_0_14px_rgba(244,63,94,.18)]"

  const neonHoverStrong =
    "hover:bg-white/75 active:bg-white/80 " +
    "hover:ring-1 hover:ring-sky-300/70 " +
    "hover:shadow-[0_0_34px_rgba(56,189,248,.55),0_0_18px_rgba(244,63,94,.22)]"

  return (
    <header className={cx(isHome && "sticky top-0", "z-50")}>
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-24">
        <div
          className={cx(
            "absolute left-1/2 top-0 h-24 w-[980px] -translate-x-1/2 rounded-full blur-3xl transition-opacity duration-500",
            compact ? "bg-cyan-300/30 opacity-100" : "bg-cyan-300/18 opacity-90"
          )}
        />
        <div
          className={cx(
            "absolute right-10 top-2 h-24 w-72 rounded-full blur-3xl transition-opacity duration-500",
            compact ? "bg-rose-300/22 opacity-100" : "bg-rose-300/16 opacity-90"
          )}
        />
      </div>

      <div className={cx("relative transition-all", isHome && compact ? "h-[68px]" : "")}>
        <div
          className={cx(
            "relative backdrop-blur-xl transition-all duration-500",
            compact
              ? "bg-white/72 border border-white/60 shadow-[0_26px_70px_-55px_rgba(2,6,23,0.55),0_0_55px_rgba(56,189,248,.22)]"
              : "bg-white/60 border-b border-white/45 shadow-[0_18px_45px_-35px_rgba(2,6,23,0.35)]",
            isHome && compact ? "floating-pill mx-auto w-[min(1100px,calc(100%-16px))] rounded-[22px]" : ""
          )}
        >
          <div className={cx("header-sweep", compact ? "opacity-40" : "opacity-30")} />
          <div className={cx("header-pulse", compact ? "opacity-55" : "opacity-35")} />
          <div className={cx("h-[2px] w-full", compact ? "neon-blue-active rounded-t-[22px]" : "neon-topline")} />
          <div className={cx("pointer-events-none absolute inset-0 neon-frame", compact ? "opacity-80" : "opacity-55")} />

          <div className="mx-auto max-w-6xl px-4">
            <div className="flex items-center justify-between gap-3 py-3">
              <Link href="/" className="group flex items-center gap-2">
                <div
                  className={cx(
                    "relative rounded-xl transition-all",
                    "bg-gradient-to-br from-sky-500 via-indigo-600 to-rose-600",
                    "shadow-[0_20px_45px_-18px_rgba(56,189,248,0.35),0_18px_40px_-22px_rgba(244,63,94,0.25)]",
                    "after:absolute after:inset-[-8px] after:rounded-xl after:bg-sky-400/25 after:blur-xl after:opacity-70",
                    isHome && compact ? "h-8 w-8" : "h-9 w-9"
                  )}
                >
                  <div className="absolute inset-0 rounded-xl ring-1 ring-white/50" />
                </div>

                <div className="leading-tight">
                  <div className="text-xs text-slate-500">OPERADORA</div>
                  <div className="font-bold tracking-wide text-slate-900">
                    BALLES{" "}
                    <span className="ml-1 text-[10px] font-semibold text-slate-500 group-hover:text-sky-600 transition">
                      • Neon
                    </span>
                  </div>
                </div>
              </Link>

              <div className="hidden md:block">
                <div
                  ref={navRef}
                  className={cx(
                    "relative flex items-center gap-2 rounded-2xl p-1.5 backdrop-blur shadow-sm transition-all duration-500",
                    compact ? "border border-white/60 bg-white/55" : "border border-white/50 bg-white/55"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cx("active-pill", compact && "active-pill-blue")}
                    style={{ transform: `translateX(${pill.x}px)`, width: `${pill.w}px`, opacity: pill.o }}
                  />
                  {nav.map((x) => {
                    const active = isActive(x.href)
                    return (
                      <Link
                        key={x.href}
                        href={x.href}
                        data-active={active ? "true" : "false"}
                        onMouseEnter={updatePill}
                        className={cx(
                          itemBase,
                          "relative z-10 text-slate-900",
                          compact ? neonHoverStrong : neonHoverSoft,
                          active && (compact ? "text-sky-900" : "text-sky-950")
                        )}
                      >
                        {x.label}
                      </Link>
                    )
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 rounded-xl border border-white/60 bg-white/55 px-3 py-2 backdrop-blur transition relative shadow-sm focus-within:ring-1 focus-within:ring-sky-300/80">
                  <Search size={18} className="text-slate-500" />
                  <input
                    className="w-40 bg-transparent outline-none text-sm text-slate-900 placeholder:text-slate-500"
                    placeholder="Buscar…"
                  />
                  <span className="pointer-events-none search-glow" />
                </div>

                <Link
                  href="/carrito"
                  className={cx(
                    "icon-neon relative grid h-10 w-10 place-items-center rounded-xl border border-white/60 bg-white/55 backdrop-blur transition shadow-sm text-slate-900",
                    compact ? "hover:shadow-[0_0_30px_rgba(56,189,248,.55)]" : ""
                  )}
                  aria-label="Carrito"
                  title="Carrito"
                >
                  <span className="relative z-10">
                    <ShoppingCart size={20} />
                  </span>
                  <span className="pointer-events-none absolute inset-[-10px] rounded-[inherit] opacity-0 blur-[14px] transition icon-glow" />
                </Link>

                <div
                  className={cx(
                    "icon-neon relative rounded-xl border border-white/60 bg-white/55 backdrop-blur transition shadow-sm",
                    compact ? "hover:shadow-[0_0_30px_rgba(56,189,248,.45)]" : ""
                  )}
                >
                  <div className="relative z-10">
                    <UserMenu />
                  </div>
                  <span className="pointer-events-none absolute inset-[-10px] rounded-[inherit] opacity-0 blur-[14px] transition icon-glow" />
                </div>
              </div>
            </div>

            <div className="md:hidden pb-3 flex gap-2 overflow-x-auto whitespace-nowrap pr-1">
              {nav.map((x) => {
                const active = isActive(x.href)
                return (
                  <Link
                    key={x.href}
                    href={x.href}
                    className={cx(
                      "relative rounded-full px-4 py-2 text-xs font-semibold backdrop-blur transition shadow-sm",
                      "border border-white/60 bg-white/55 text-slate-800",
                      active && "ring-1 ring-sky-300/70 bg-white/80 text-sky-950"
                    )}
                  >
                    <span className={cx(active && "bg-gradient-to-r from-sky-600 via-indigo-600 to-rose-500 bg-clip-text text-transparent")}>
                      {x.label}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className={cx("h-[2px] w-full opacity-90", compact ? "neon-blue-active rounded-b-[22px]" : "neon-botline")} />

          {/* tu <style> igual que antes (no lo toqué) */}
        </div>
      </div>
    </header>
  )
}
