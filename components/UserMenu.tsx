"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { User, LogOut, Settings, History } from "lucide-react"

function cx(...s: Array<string | false | null | undefined>) {
  return s.filter(Boolean).join(" ")
}

export default function UserMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  // ✅ cerrar click afuera + Escape
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!ref.current) return
      if (!ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [])

  // ⚠️ Ajusta esto a tu lógica real (auth)
  const userName = "Admin"
  const userRole = "ADMIN"

  return (
    <div ref={ref} className="relative z-[90]">
      {/* Botón */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cx(
          "group grid h-10 w-10 place-items-center rounded-xl",
          "border border-white/45 bg-white/55 backdrop-blur",
          "transition",
          "hover:bg-sky-500/15 hover:shadow-[0_0_30px_rgba(56,189,248,.60)] hover:ring-1 hover:ring-sky-300/70",
          "active:scale-[0.98]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/80"
        )}
        aria-label="Usuario"
      >
        <User size={18} className="text-slate-800" />
      </button>

      {/* Dropdown */}
      <div
        className={cx(
          "absolute right-0 top-full mt-2 z-[120]",
          "w-[min(92vw,340px)] overflow-hidden",
          "rounded-2xl border border-white/40 bg-white/90 backdrop-blur-xl",
          "shadow-[0_40px_120px_-70px_rgba(0,0,0,.9)]",
          "origin-top-right transition",
          open ? "scale-100 opacity-100" : "pointer-events-none scale-[0.98] opacity-0"
        )}
      >
        <div className="p-3">
          <div className="rounded-2xl border border-white/45 bg-white/60 p-3">
            <div className="text-sm font-bold text-slate-900">{userName}</div>
            <div className="text-xs text-slate-600">{userRole}</div>
          </div>

          <div className="mt-3 grid gap-1">
            <MenuLink href="/pedidos" icon={<History size={16} />} onPick={() => setOpen(false)}>
              Historial de pedidos
            </MenuLink>

            <MenuLink href="/admin/productos" icon={<Settings size={16} />} onPick={() => setOpen(false)}>
              Administrar catálogo
            </MenuLink>

            <button
              type="button"
              onClick={() => {
                setOpen(false)
                // 👇 Ajusta esto si usas next-auth o tu propia ruta
                window.location.href = "/logout"
              }}
              className={cx(
                "mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold",
                "text-rose-700 hover:bg-rose-50"
              )}
            >
              <LogOut size={16} />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function MenuLink({
  href,
  children,
  icon,
  onPick,
}: {
  href: string
  children: React.ReactNode
  icon: React.ReactNode
  onPick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onPick}
      className={cx(
        "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900",
        "hover:bg-sky-500/10 hover:shadow-[0_0_18px_rgba(56,189,248,.35)]"
      )}
    >
      <span className="text-slate-700">{icon}</span>
      {children}
    </Link>
  )
}
