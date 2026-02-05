"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import {
  User as UserIcon,
  LogOut,
  LogIn,
  ListOrdered,
  PlusCircle,
} from "lucide-react"

type SessionUser = {
  name?: string | null
  role?: string | null
}

export default function UserMenu() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<SessionUser | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  async function loadSession() {
    try {
      const res = await fetch("/api/auth/session", { cache: "no-store" })
      const s = await res.json()
      const u = s?.user
      if (u) setUser({ name: u.name, role: u.role })
      else setUser(null)
    } catch {
      setUser(null)
    }
  }

  useEffect(() => {
    loadSession()
  }, [])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!ref.current) return
      if (!ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [])

  async function onLogout() {
    try {
      localStorage.removeItem("cart_v1")
    } catch {}
    await signOut({ callbackUrl: "/" })
  }

  const callbackUrl = encodeURIComponent(pathname || "/")

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={async () => {
          await loadSession()
          setOpen((v) => !v)
        }}
        className="rounded-xl border bg-white p-2 hover:bg-slate-50"
        aria-label="Usuario"
        title="Usuario"
      >
        <UserIcon size={20} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border bg-white shadow-lg">
          <div className="px-4 py-3">
            {user ? (
              <>
                <div className="text-sm font-semibold">
                  {user.name ?? "Usuario"}
                </div>
                <div className="text-xs text-slate-600">{user.role ?? "—"}</div>
              </>
            ) : (
              <>
                <div className="text-sm font-semibold">
                  No has iniciado sesión
                </div>
                <div className="text-xs text-slate-600">
                  Puedes navegar el catálogo
                </div>
              </>
            )}
          </div>

          <div className="h-px bg-slate-100" />

          <div className="p-2">
            {user ? (
              <>
                <Link
                  href="/pedidos"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium hover:bg-slate-50"
                >
                  <ListOrdered size={18} />
                  Historial de pedidos
                </Link>

                {/* ✅ SOLO ADMIN */}
                {user.role === "ADMIN" && (
                  <Link
                    href="/admin/productos"
                    onClick={() => setOpen(false)}
                    className="mt-1 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium hover:bg-slate-50"
                  >
                    <PlusCircle size={18} />
                    Administrar Catalogo
                  </Link>
                )}

                <button
                  onClick={onLogout}
                  className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-rose-700 hover:bg-rose-50"
                >
                  <LogOut size={18} />
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link
                href={`/login?callbackUrl=${callbackUrl}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold hover:bg-slate-50"
              >
                <LogIn size={18} />
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
