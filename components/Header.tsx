"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, Search, User } from "lucide-react"
import UserMenu from "@/components/UserMenu"

export default function Header() {
  const pathname = usePathname()
  const isHome = pathname === "/"

  return (
    <header
      className={[
        isHome ? "sticky top-0 z-50" : "",
        "border-b border-slate-200/60 bg-white/72 backdrop-blur-xl",
        "shadow-[0_10px_30px_-25px_rgba(2,6,23,0.25)]",
      ].join(" ")}
    >
      {/* Glow detrás del header (azul + rojo) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-white/30" />
        <div className="absolute -top-10 left-1/2 h-28 w-[680px] -translate-x-1/2 rounded-full bg-cyan-300/20 blur-2xl" />
        <div className="absolute -top-10 right-10 h-28 w-72 rounded-full bg-rose-300/16 blur-2xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between gap-3 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-sky-600 to-rose-500 shadow-[0_14px_35px_-22px_rgba(244,63,94,0.55)]" />
            <div className="leading-tight">
              <div className="text-xs text-slate-500">OPERADORA</div>
              <div className="font-bold tracking-wide">BALLES</div>
            </div>
          </Link>

          {/* Nav Desktop */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <NavLink href="/" active={pathname === "/"}>Inicio</NavLink>
            <NavLink href="/nosotros" active={pathname.startsWith("/nosotros")}>Nosotros</NavLink>
            <NavLink href="/productos" active={pathname.startsWith("/productos")}>Catálogo</NavLink>
            <NavLink href="/contacto" active={pathname.startsWith("/contacto")}>Contacto</NavLink>
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2">
            {/* Search (desktop) */}
            <div className="hidden sm:block">
              <div className="search-neon group flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/80 px-3 py-2 shadow-sm">
                <Search size={18} className="text-slate-500" />
                <input
                  className="w-56 bg-transparent outline-none text-sm text-slate-900 placeholder:text-slate-400"
                  placeholder="Buscar…"
                />
                <span className="pointer-events-none search-glow" />
              </div>
            </div>

            {/* Carrito */}
            <Link
              href="/carrito"
              className="icon-neon rounded-xl border border-slate-200/80 bg-white/80 p-2 shadow-sm"
              aria-label="Carrito"
              title="Carrito"
            >
              <ShoppingCart size={20} />
            </Link>

            {/* UserMenu */}
            <div className="icon-neon rounded-xl border border-slate-200/80 bg-white/80 p-1.5 shadow-sm">
              <UserMenu />
            </div>
          </div>
        </div>

        {/* Nav móvil */}
        <div className="md:hidden pb-3 flex gap-2 overflow-x-auto whitespace-nowrap">
          <MobileLink href="/" active={pathname === "/"}>Inicio</MobileLink>
          <MobileLink href="/nosotros" active={pathname.startsWith("/nosotros")}>Nosotros</MobileLink>
          <MobileLink href="/productos" active={pathname.startsWith("/productos")}>Catálogo</MobileLink>
          <MobileLink href="/contacto" active={pathname.startsWith("/contacto")}>Contacto</MobileLink>
          <MobileLink href="/carrito" active={pathname.startsWith("/carrito")}>Carrito</MobileLink>
        </div>
      </div>

      {/* línea neon abajo */}
      <div className="h-[2px] w-full bg-gradient-to-r from-cyan-500/45 via-indigo-500/25 to-rose-500/40 opacity-90" />

      {/* CSS local (para el neon del header) */}
      <style>{`
        /* Underline neon animado en links */
        @keyframes underlineShift {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .u-neon {
          background-size: 200% 200%;
          animation: underlineShift 3.6s ease-in-out infinite;
        }

        /* Glow del search al focus */
        .search-neon { position: relative; }
        .search-glow {
          position: absolute;
          inset: -2px;
          border-radius: 14px;
          opacity: 0;
          transition: opacity 180ms ease;
          background: radial-gradient(120px 60px at 30% 50%, rgba(56,189,248,.35), transparent 65%),
                      radial-gradient(120px 60px at 78% 50%, rgba(244,63,94,.28), transparent 65%);
          filter: blur(10px);
          z-index: -1;
        }
        .search-neon:focus-within .search-glow { opacity: 1; }

        /* Icons hover neon */
        .icon-neon { transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease; }
        .icon-neon:hover {
          transform: translateY(-1px);
          background: rgba(255,255,255,.92);
          box-shadow: 0 18px 40px -28px rgba(2,6,23,.35);
        }

        /* Reduce motion */
        @media (prefers-reduced-motion: reduce) {
          .u-neon { animation: none !important; }
        }
      `}</style>
    </header>
  )
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string
  active?: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={[
        "relative rounded-lg px-2 py-1 transition",
        active ? "text-slate-900 font-semibold" : "text-slate-700 hover:text-slate-900",
      ].join(" ")}
    >
      {children}

      {/* underline neon */}
      <span
        className={[
          "absolute left-2 right-2 -bottom-1 h-[2px] rounded-full transition",
          active ? "opacity-100" : "opacity-0",
          "u-neon bg-gradient-to-r from-cyan-500 via-indigo-500 to-rose-500",
        ].join(" ")}
      />
    </Link>
  )
}

function MobileLink({
  href,
  active,
  children,
}: {
  href: string
  active?: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={[
        "rounded-full border px-3 py-1 text-sm font-semibold shadow-sm transition",
        active
          ? "border-slate-200 bg-white/90 text-slate-900"
          : "border-slate-200/80 bg-white/70 text-slate-700 hover:bg-white/90",
      ].join(" ")}
      style={
        active
          ? {
              boxShadow:
                "0 18px 40px -32px rgba(2,6,23,.35), 0 0 0 1px rgba(56,189,248,.15) inset",
            }
          : undefined
      }
    >
      <span className={active ? "bg-gradient-to-r from-cyan-600 via-indigo-600 to-rose-600 bg-clip-text text-transparent" : ""}>
        {children}
      </span>
    </Link>
  )
}
