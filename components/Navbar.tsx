"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, Search } from "lucide-react"
import UserMenu from "@/components/UserMenu"

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ")
}

function NavLink({
  href,
  label,
}: {
  href: string
  label: string
}) {
  const pathname = usePathname()
  const active = pathname === href || (href !== "/" && pathname.startsWith(href))

  return (
    <Link
      href={href}
      className={cn(
        "relative text-sm font-medium transition",
        active ? "text-blue-900" : "text-slate-600 hover:text-blue-700"
      )}
    >
      {label}
      {active && (
        <span className="absolute -bottom-2 left-0 h-[2px] w-full rounded-full bg-blue-600" />
      )}
    </Link>
  )
}

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50">
      <div className="border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 shadow-[0_10px_30px_-25px_rgba(2,6,23,0.35)]">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between gap-3 py-3">
            {/* Logo + nombre */}
            <Link href="/" className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-b from-blue-600 to-blue-800 shadow-[0_18px_35px_-20px_rgba(30,58,138,0.75)]" />
              <div className="leading-tight">
                <div className="text-[11px] tracking-widest text-slate-500">
                  OPERADORA
                </div>
                <div className="font-extrabold tracking-wide text-slate-900">
                  BALLES
                </div>
              </div>
            </Link>

            {/* Menu desktop */}
            <nav className="hidden md:flex items-center gap-6">
              <NavLink href="/" label="Inicio" />
              <NavLink href="/productos" label="Catálogo" />
              <NavLink href="/contacto" label="Contacto" />

              {/* CTA rojo */}
              <Link
                href="/generar-pedido"
                className="ml-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_18px_35px_-20px_rgba(220,38,38,0.8)] hover:bg-red-700 transition"
              >
                Generar pedido
              </Link>

              <NavLink href="/carrito" label="Carrito" />
            </nav>

            {/* Search + icons */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-300 transition">
                <Search size={18} className="text-slate-500" />
                <input
                  className="w-56 bg-transparent outline-none text-sm placeholder:text-slate-400"
                  placeholder="Buscar…"
                />
              </div>

              {/* Carrito */}
              <Link
                href="/carrito"
                className="relative rounded-2xl border border-slate-200 bg-white/80 p-2 shadow-sm hover:bg-slate-50 transition"
                aria-label="Carrito"
                title="Carrito"
              >
                <ShoppingCart size={20} />
                {/* badge (luego lo conectamos al contador real) */}
                <span className="absolute -right-1 -top-1 h-4 min-w-4 rounded-full bg-red-600 px-1 text-[10px] leading-4 text-white text-center">
                  0
                </span>
              </Link>

              <UserMenu />
            </div>
          </div>

          {/* Menu móvil (chips) */}
          <div className="md:hidden pb-3 flex gap-2 text-sm overflow-x-auto">
            {[
              { href: "/", label: "Inicio" },
              { href: "/productos", label: "Productos" },
              { href: "/generar-pedido", label: "Generar" },
              { href: "/contacto", label: "Contacto" },
              { href: "/carrito", label: "Carrito" },
              { href: "/accesorios", label: "Accesorios" },
            ].map((i) => (
              <Link
                key={i.href}
                href={i.href}
                className="whitespace-nowrap rounded-full border border-slate-200 bg-white/80 px-3 py-2 shadow-sm hover:border-blue-200 hover:bg-white transition"
              >
                {i.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
