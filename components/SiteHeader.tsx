"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, Search } from "lucide-react"
import UserMenu from "@/components/UserMenu"
import { useEffect, useMemo, useRef, useState } from "react"

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
    return pathname === href || pathname.startsWith(href + "/")
  }

  // =========================
  // ✅ ACTIVE PILL (deslizante)
  // =========================
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

  // Hover normal (arriba)
  const neonHoverSoft =
    "hover:bg-white/70 active:bg-white/75 " +
    "hover:ring-1 hover:ring-sky-300/60 " +
    "hover:shadow-[0_0_22px_rgba(56,189,248,.30),0_0_14px_rgba(244,63,94,.18)]"

  // Hover más fuerte (cuando bajas)
  const neonHoverStrong =
    "hover:bg-white/75 active:bg-white/80 " +
    "hover:ring-1 hover:ring-sky-300/70 " +
    "hover:shadow-[0_0_34px_rgba(56,189,248,.55),0_0_18px_rgba(244,63,94,.22)]"

  return (
    <header className={cx(isHome && "sticky top-0", "z-50")}>
      {/* Glow detrás (se intensifica al bajar) */}
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

      {/* Wrapper: evita salto cuando se vuelve fixed */}
      <div className={cx("relative transition-all", isHome && compact ? "h-[68px]" : "")}>
        <div
          className={cx(
            "relative backdrop-blur-xl transition-all duration-500",
            // ✅ SIEMPRE CLARO, pero al bajar más “neon”
            compact
              ? "bg-white/72 border border-white/60 shadow-[0_26px_70px_-55px_rgba(2,6,23,0.55),0_0_55px_rgba(56,189,248,.22)]"
              : "bg-white/60 border-b border-white/45 shadow-[0_18px_45px_-35px_rgba(2,6,23,0.35)]",
            // ✅ Floating pill solo Home + compact
            isHome && compact ? "floating-pill mx-auto w-[min(1100px,calc(100%-16px))] rounded-[22px]" : ""
          )}
        >
          {/* Sweep + Pulse */}
          <div className={cx("header-sweep", compact ? "opacity-40" : "opacity-30")} />
          <div className={cx("header-pulse", compact ? "opacity-55" : "opacity-35")} />

          {/* Línea neon arriba (al bajar más intensa azul) */}
          <div className={cx("h-[2px] w-full", compact ? "neon-blue-active rounded-t-[22px]" : "neon-topline")} />

          {/* Frame neon sutil (al bajar más brillante) */}
          <div className={cx("pointer-events-none absolute inset-0 neon-frame", compact ? "opacity-80" : "opacity-55")} />

          <div className="mx-auto max-w-6xl px-4">
            <div className="flex items-center justify-between gap-3 py-3">
              {/* LOGO */}
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

              {/* MENU DESKTOP (Active Pill) */}
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
                    style={{
                      transform: `translateX(${pill.x}px)`,
                      width: `${pill.w}px`,
                      opacity: pill.o,
                    }}
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

              {/* DERECHA */}
              <div className="flex items-center gap-2">
                {/* Search */}
                <div className="hidden sm:flex items-center gap-2 rounded-xl border border-white/60 bg-white/55 px-3 py-2 backdrop-blur transition relative shadow-sm focus-within:ring-1 focus-within:ring-sky-300/80">
                  <Search size={18} className="text-slate-500" />
                  <input
                    className="w-40 bg-transparent outline-none text-sm text-slate-900 placeholder:text-slate-500"
                    placeholder="Buscar…"
                  />
                  <span className="pointer-events-none search-glow" />
                </div>

                {/* Carrito */}
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

                {/* Usuario */}
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

            {/* MENU MOVIL */}
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

          {/* Línea neon abajo */}
          <div className={cx("h-[2px] w-full opacity-90", compact ? "neon-blue-active rounded-b-[22px]" : "neon-botline")} />

          <style>{`
            /* ========== Floating pill (Home + compact) ========== */
            .floating-pill{
              position: fixed;
              left: 50%;
              transform: translateX(-50%);
              top: 10px;
              z-index: 60;
              animation: pillIn 240ms ease-out both;
            }
            @keyframes pillIn{
              from { opacity: 0; transform: translateX(-50%) translateY(-6px) scale(.985); }
              to   { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
            }

            /* ========== Sweep + Pulse ========== */
            .header-sweep{
              position:absolute; inset:0; pointer-events:none;
              background:
                radial-gradient(600px 200px at 20% 10%, rgba(255,255,255,.65), transparent 60%),
                radial-gradient(420px 180px at 82% 20%, rgba(255,255,255,.42), transparent 60%);
              animation:sweepMove 8s ease-in-out infinite;
            }
            @keyframes sweepMove{
              0%{ transform:translateX(0px); }
              50%{ transform:translateX(24px); }
              100%{ transform:translateX(0px); }
            }
            .header-pulse{
              position:absolute; inset:0; pointer-events:none;
              background: radial-gradient(700px 260px at 50% -10%, rgba(56,189,248,.20), transparent 60%),
                          radial-gradient(700px 260px at 55% -10%, rgba(244,63,94,.10), transparent 60%);
              animation:pulseSoft 6s ease-in-out infinite;
            }
            @keyframes pulseSoft{
              0%,100%{ opacity:.45; }
              50%{ opacity:.95; }
            }

            /* ========== Neon normal (suave) ========== */
            .neon-topline, .neon-botline{
              background: linear-gradient(90deg,
                rgba(56,189,248,.45),
                rgba(99,102,241,.22),
                rgba(244,63,94,.28),
                rgba(56,189,248,.45)
              );
              background-size: 200% 200%;
              animation: neonShift 5.2s ease-in-out infinite;
              filter: drop-shadow(0 10px 18px rgba(56,189,248,.18));
            }
            .neon-botline{ animation-duration: 6.2s; }

            /* ========== Neon compacto (azul PROTAGONISTA) ========== */
            .neon-blue-active{
              background: linear-gradient(90deg,
                rgba(56,189,248,.95),
                rgba(34,211,238,.85),
                rgba(99,102,241,.35),
                rgba(244,63,94,.35),
                rgba(56,189,248,.95)
              );
              background-size: 240% 240%;
              animation: neonShiftFast 3.2s linear infinite;
              filter:
                drop-shadow(0 12px 26px rgba(56,189,248,.40))
                drop-shadow(0 0 28px rgba(56,189,248,.25))
                drop-shadow(0 0 16px rgba(244,63,94,.14));
            }

            @keyframes neonShift {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            @keyframes neonShiftFast {
              0% { background-position: 0% 50%; }
              100% { background-position: 200% 50%; }
            }

            /* Frame neon */
            .neon-frame::after{
              content:"";
              position:absolute; inset:0; pointer-events:none;
              padding: 1px;
              background: conic-gradient(from 180deg,
                rgba(56,189,248,.34),
                rgba(34,211,238,.18),
                rgba(99,102,241,.14),
                rgba(244,63,94,.16),
                rgba(56,189,248,.34)
              );
              -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
              -webkit-mask-composite: xor;
              mask-composite: exclude;
              opacity: .38;
              animation: neonSpin 11s linear infinite;
              border-radius: inherit;
            }
            @keyframes neonSpin { to { transform: rotate(360deg); } }

            /* Active pill */
            .active-pill{
              position:absolute;
              top: 6px; bottom: 6px; left: 6px;
              border-radius: 14px;
              background: linear-gradient(90deg,
                rgba(56,189,248,.22),
                rgba(99,102,241,.14),
                rgba(244,63,94,.16)
              );
              box-shadow:
                0 18px 45px -35px rgba(2,6,23,.35),
                0 0 18px rgba(56,189,248,.16);
              transition: transform 220ms ease, width 220ms ease, opacity 180ms ease;
              will-change: transform, width;
            }
            .active-pill-blue{
              background: linear-gradient(90deg,
                rgba(56,189,248,.30),
                rgba(34,211,238,.20),
                rgba(99,102,241,.12),
                rgba(244,63,94,.14)
              );
              box-shadow:
                0 22px 55px -44px rgba(2,6,23,.40),
                0 0 26px rgba(56,189,248,.22);
            }

            /* Search glow */
            .search-glow{
              position: absolute;
              inset: -2px;
              border-radius: 12px;
              opacity: 0;
              transition: opacity 180ms ease;
              background:
                radial-gradient(140px 60px at 28% 50%, rgba(56,189,248,.35), transparent 65%),
                radial-gradient(140px 60px at 78% 50%, rgba(244,63,94,.22), transparent 65%);
              filter: blur(10px);
              z-index: -1;
            }
            div:focus-within > .search-glow { opacity: 1; }

            /* Icons glow */
            .icon-neon{
              transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease, border-color 160ms ease;
            }
            .icon-neon:hover{
              transform: translateY(-1px);
              box-shadow:
                0 18px 40px -28px rgba(2,6,23,.35),
                0 0 22px rgba(56,189,248,.18);
            }
            .icon-glow{
              background:
                radial-gradient(80px 40px at 30% 50%, rgba(56,189,248,.40), transparent 70%),
                radial-gradient(80px 40px at 78% 50%, rgba(244,63,94,.22), transparent 70%);
            }
            .icon-neon:hover .icon-glow{ opacity: 1; }

            /* Reduced motion */
            @media (prefers-reduced-motion: reduce) {
              .neon-topline, .neon-botline, .neon-blue-active, .neon-frame::after,
              .header-sweep, .header-pulse { animation: none !important; }
              .active-pill, .floating-pill { transition: none !important; animation: none !important; }
            }
          `}</style>
        </div>
      </div>
    </header>
  )
}
