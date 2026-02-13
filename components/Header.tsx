"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, Search } from "lucide-react"
import Image from "next/image"
import UserMenu from "@/components/UserMenu"

export default function Header() {
  const pathname = usePathname()
  const isHome = pathname === "/"

  return (
    <header className={isHome ? "sticky top-0 z-50 border-b bg-white/80 backdrop-blur" : "border-b bg-white/80 backdrop-blur"}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between gap-3 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-sky-600 shadow-[0_0_0_0_rgba(56,189,248,0.0)]" />
            <div className="leading-tight">
              <div className="text-xs text-slate-500">OPERADORA</div>
              <div className="font-bold tracking-wide">BALLES</div>
            </div>
          </Link>

          {/* Opciones como tu imagen */}
          <nav className="hidden md:flex items-center gap-5 text-sm">
            <Link className="neon-link" href="/">Inicio</Link>
            <Link className="neon-link" href="/nosotros">Nosotros</Link>
            <Link className="neon-link" href="/productos">Catalogo</Link>
            <Link className="neon-link" href="/contacto">Contacto</Link>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 rounded-xl border bg-white px-3 py-2">
              <Search size={18} className="text-slate-500" />
              <input className="w-56 outline-none text-sm" placeholder="Buscar…" />
            </div>

            <Link href="/carrito" className="neon-icon rounded-xl border bg-white p-2" aria-label="Carrito" title="Carrito">
              <ShoppingCart size={20} />
            </Link>

            <UserMenu />
          </div>
        </div>

        {/* Menu móvil */}
        <div className="md:hidden pb-3 flex gap-3 text-sm overflow-x-auto whitespace-nowrap">
          <Link className="neon-link whitespace-nowrap" href="/">Inicio</Link>
          <Link className="neon-link whitespace-nowrap" href="/nosotros">Nosotros</Link>
          <Link className="neon-link whitespace-nowrap" href="/productos">Catalogo</Link>
          <Link className="neon-link whitespace-nowrap" href="/contacto">Contacto</Link>
          <Link className="neon-link whitespace-nowrap" href="/carrito">Carrito</Link>
        </div>
      </div>

      {/* WhatsApp flotante */}
      <a
        href="https://wa.me/5217715565797"
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        className="fixed bottom-5 right-5 z-50 transition hover:-translate-y-1"
      >
        <div className="relative h-16 w-16 rounded-full shadow-[0_20px_45px_-20px_rgba(0,0,0,0.45)] hover:shadow-[0_28px_65px_-25px_rgba(0,0,0,0.55)]">
          <Image src="/icons/whatsapp.png" alt="WhatsApp" fill className="object-contain" priority />
        </div>
      </a>
    </header>
  )
}
