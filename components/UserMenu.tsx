"use client"

import Link from "next/link"
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  User,
  ChevronDown,
  History,
  Settings,
  LogOut,
  SlidersHorizontal,
  KeyRound,
} from "lucide-react"

function cx(...s: Array<string | false | null | undefined>) {
  return s.filter(Boolean).join(" ")
}

type BtnRect = { top: number; bottom: number; left: number; right: number }

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function rubberBand(distance: number, dimension: number, k = 0.55) {
  return (distance * dimension * k) / (dimension + k * distance)
}

function initials(name: string) {
  const t = (name || "").trim()
  if (!t) return "U"
  const parts = t.split(/\s+/).slice(0, 2)
  const a = parts[0]?.[0] ?? "U"
  const b = parts[1]?.[0] ?? ""
  return (a + b).toUpperCase()
}

function roleLabel(role: string) {
  if (role === "ADMIN") return "Administrador"
  return "Usuario"
}

function rolePill(role: string, isAuthed: boolean) {
  if (!isAuthed) return "Invitado"
  return roleLabel(role)
}

export default function UserMenu() {
  const router = useRouter()
  const { data: session, status } = useSession()

  const isAuthed = status === "authenticated"
  const userName = session?.user?.name ?? session?.user?.email ?? "Usuario"
  const userRole = (session as any)?.user?.role ?? "USER"

  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const btnRef = useRef<HTMLButtonElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)

  const [mounted, setMounted] = useState(false)
  const [btnRect, setBtnRect] = useState<BtnRect>({ top: 0, bottom: 0, left: 0, right: 0 })
  const [panelH, setPanelH] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [preferUp, setPreferUp] = useState(false)

  const [vw, setVw] = useState(1024)
  const [vh, setVh] = useState(768)

  // mobile drag sheet
  const [dragY, setDragY] = useState(0)
  const draggingRef = useRef(false)
  const startYRef = useRef(0)
  const sheetScrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth || 1024
      const h = window.innerHeight || 768
      setVw(w)
      setVh(h)
      setIsMobile(w < 640)
    }
    calc()
    window.addEventListener("resize", calc)
    return () => window.removeEventListener("resize", calc)
  }, [])

  const computeBtnRect = () => {
    const btn = btnRef.current
    if (!btn) return
    const r = btn.getBoundingClientRect()
    setBtnRect({ top: r.top, bottom: r.bottom, left: r.left, right: r.right })
  }

  useLayoutEffect(() => {
    if (!open) return
    computeBtnRect()
    const raf = requestAnimationFrame(() => computeBtnRect())
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    if (!open) return
    const onScroll = () => computeBtnRect()
    const onResize = () => computeBtnRect()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
    }
  }, [open])

  useLayoutEffect(() => {
    if (!open) return
    const raf = requestAnimationFrame(() => {
      const h = panelRef.current?.getBoundingClientRect().height ?? 0
      setPanelH(h)
    })
    return () => cancelAnimationFrame(raf)
  }, [open, isMobile])

  useEffect(() => {
    if (!open) return
    if (isMobile) {
      setPreferUp(false)
      return
    }
    const margin = 12
    const spaceBelow = vh - btnRect.bottom
    const needsUp = panelH > 0 && spaceBelow < panelH + margin
    setPreferUp(needsUp)
  }, [open, isMobile, btnRect.bottom, panelH, vh])

  useEffect(() => {
    if (!open) return
    function onDown(e: MouseEvent) {
      const t = e.target as Node
      const root = rootRef.current
      const panel = panelRef.current
      if (root && root.contains(t)) return
      if (panel && panel.contains(t)) return
      setOpen(false)
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
  }, [open])

  useEffect(() => setDragY(0), [open])

  function canDragFromScrollTop() {
    const sc = sheetScrollRef.current
    if (!sc) return true
    return sc.scrollTop <= 0
  }

  function onSheetPointerDown(e: React.PointerEvent) {
    if (!isMobile) return
    if (!canDragFromScrollTop()) return
    draggingRef.current = true
    startYRef.current = e.clientY
    ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
  }

  function onSheetPointerMove(e: React.PointerEvent) {
    if (!isMobile) return
    if (!draggingRef.current) return
    const delta = e.clientY - startYRef.current
    if (delta <= 0) {
      setDragY(0)
      return
    }
    const dim = Math.max(320, vh)
    setDragY(rubberBand(delta, dim, 0.6))
  }

  function onSheetPointerUp() {
    if (!isMobile) return
    if (!draggingRef.current) return
    draggingRef.current = false
    const threshold = Math.max(110, Math.min(180, vh * 0.18))
    if (dragY > threshold) {
      setOpen(false)
      return
    }
    setDragY(0)
  }

  const dropdownStyle = useMemo(() => {
    const margin = 12
    const maxW = Math.min(360, Math.floor(vw * 0.92))

    let left = btnRect.right - maxW
    if (left < margin) left = margin
    if (left + maxW > vw - margin) left = vw - maxW - margin

    const top = preferUp
      ? Math.max(margin, btnRect.top - panelH - 10)
      : Math.max(margin, btnRect.bottom + 10)

    return { left, top, width: maxW }
  }, [btnRect.right, btnRect.bottom, btnRect.top, preferUp, panelH, vw])

  const overlayOpacity = useMemo(() => {
    if (!isMobile) return 1
    const t = clamp(1 - dragY / (vh * 0.6 || 600), 0.15, 1)
    return t
  }, [dragY, isMobile, vh])

  async function doLogout() {
    setOpen(false)
    await signOut({ callbackUrl: "/login" })
    router.refresh()
  }

  const roleText = rolePill(userRole, isAuthed)

  return (
    <div ref={rootRef} className="relative">
      {/* ✅ Botón (estilo mini header como tu imagen) */}
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cx(
          "group flex items-center gap-2 h-10 rounded-2xl pl-2 pr-2.5",
          "border border-white/45 bg-white/55 backdrop-blur-xl",
          "shadow-[0_14px_44px_-30px_rgba(2,6,23,.45)]",
          "transition",
          "hover:bg-white/75 hover:ring-1 hover:ring-sky-300/70 hover:shadow-[0_0_26px_rgba(56,189,248,.25)]",
          "active:scale-[0.99]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/80"
        )}
        aria-label="Cuenta"
        aria-expanded={open}
      >
        <span
          className={cx(
            "grid h-8 w-8 place-items-center rounded-xl",
            "border border-white/55 bg-white/70",
            "shadow-[0_12px_30px_-22px_rgba(2,6,23,.55)]"
          )}
        >
          <span className="text-[11px] font-extrabold text-slate-800">
            {isAuthed ? initials(userName) : "?"}
          </span>
        </span>

        <span className="hidden sm:flex flex-col items-start leading-tight">
          <span className="max-w-[140px] truncate text-[12px] font-extrabold text-slate-900">
            {userName}
          </span>
          <span className="text-[11px] font-semibold text-slate-600">{roleText}</span>
        </span>

        <ChevronDown
          size={16}
          className={cx(
            "hidden sm:block text-slate-700 transition-transform",
            open ? "rotate-180" : "rotate-0"
          )}
        />
      </button>

      {mounted && open
        ? createPortal(
            <>
              {/* overlay */}
              <div
                className="fixed inset-0 z-[9998] usermenu-overlay"
                style={{ opacity: overlayOpacity }}
                onClick={() => setOpen(false)}
                aria-hidden="true"
              />

              {isMobile ? (
                /* ✅ MOBILE sheet (mismo diseño) */
                <div className="fixed inset-x-0 bottom-0 z-[9999] px-3 pb-3">
                  <div
                    ref={panelRef}
                    className={cx(
                      "usermenu-sheet w-full overflow-hidden rounded-[26px]",
                      "border border-white/60 bg-white/92 backdrop-blur-xl",
                      "shadow-[0_34px_110px_-70px_rgba(2,6,23,.85)]"
                    )}
                    style={{
                      maxHeight: "84vh",
                      transform: `translateY(${dragY}px)`,
                      transition: draggingRef.current ? "none" : "transform 220ms cubic-bezier(.2,.9,.2,1)",
                    }}
                    role="dialog"
                    aria-modal="true"
                  >
                    {/* Grab + header */}
                    <div
                      className="cursor-grab active:cursor-grabbing select-none"
                      onPointerDown={onSheetPointerDown}
                      onPointerMove={onSheetPointerMove}
                      onPointerUp={onSheetPointerUp}
                      onPointerCancel={onSheetPointerUp}
                    >
                      <div className="flex justify-center pt-3 pb-2">
                        <div className="h-1.5 w-12 rounded-full bg-slate-200" />
                      </div>

                      <HeaderCard
                        userName={userName}
                        roleText={roleText}
                        isAuthed={isAuthed}
                        initialsText={isAuthed ? initials(userName) : "?"}
                      />
                    </div>

                    <div
                      ref={sheetScrollRef}
                      className="px-4 pb-4 overflow-y-auto"
                      style={{ maxHeight: "calc(84vh - 124px)" }}
                    >
                      <MenuSections
                        isAuthed={isAuthed}
                        userRole={userRole}
                        onPick={() => setOpen(false)}
                        onLogout={doLogout}
                      />
                      <div className="pointer-events-none sticky bottom-0 h-10 bg-gradient-to-t from-white/90 to-transparent" />
                    </div>
                  </div>

                  <style>{`
                    .usermenu-overlay{
                      background: rgba(2,6,23,.20);
                      backdrop-filter: blur(14px);
                      -webkit-backdrop-filter: blur(14px);
                      transition: opacity 180ms ease;
                    }
                    @keyframes sheetIn {
                      from { opacity: 0; transform: translateY(18px) scale(.985); }
                      to   { opacity: 1; transform: translateY(0) scale(1); }
                    }
                    .usermenu-sheet{ animation: sheetIn 180ms ease-out both; }
                    @media (prefers-reduced-motion: reduce) {
                      .usermenu-sheet { animation: none !important; }
                      .usermenu-overlay { transition: none !important; }
                    }
                  `}</style>
                </div>
              ) : (
                /* ✅ DESKTOP dropdown tipo la imagen */
                <div
                  ref={panelRef}
                  className={cx(
                    "fixed z-[9999]",
                    "overflow-hidden rounded-2xl",
                    "border border-white/55 bg-white/88 backdrop-blur-xl",
                    "shadow-[0_42px_130px_-78px_rgba(2,6,23,.95)]",
                    preferUp ? "origin-bottom-right" : "origin-top-right",
                    "menu-in"
                  )}
                  style={{ top: dropdownStyle.top, left: dropdownStyle.left, width: dropdownStyle.width }}
                  role="dialog"
                  aria-modal="true"
                >
                  {/* top glow */}
                  <div className="pointer-events-none absolute -top-28 left-1/2 h-44 w-[540px] -translate-x-1/2 rounded-full bg-sky-300/18 blur-[90px]" />

                  <div className="relative">
                    <HeaderCard
                      userName={userName}
                      roleText={roleText}
                      isAuthed={isAuthed}
                      initialsText={isAuthed ? initials(userName) : "?"}
                    />

                    <div className="px-3 pb-3">
                      <MenuSections
                        isAuthed={isAuthed}
                        userRole={userRole}
                        onPick={() => setOpen(false)}
                        onLogout={doLogout}
                      />
                    </div>
                  </div>

                  <style>{`
                    @keyframes menuInDown {
                      from { opacity: 0; transform: translateY(-10px) scale(.985); }
                      to   { opacity: 1; transform: translateY(0) scale(1); }
                    }
                    @keyframes menuInUp {
                      from { opacity: 0; transform: translateY(10px) scale(.985); }
                      to   { opacity: 1; transform: translateY(0) scale(1); }
                    }
                    .menu-in { animation: ${preferUp ? "menuInUp" : "menuInDown"} 170ms ease-out both; }
                    @media (prefers-reduced-motion: reduce) {
                      .menu-in { animation: none !important; }
                    }
                  `}</style>
                </div>
              )}
            </>,
            document.body
          )
        : null}
    </div>
  )
}

/* =========================
   Pieces
========================= */

function HeaderCard({
  userName,
  roleText,
  isAuthed,
  initialsText,
}: {
  userName: string
  roleText: string
  isAuthed: boolean
  initialsText: string
}) {
  return (
    <div className="px-3 pt-3 pb-2">
      <div
        className={cx(
          "rounded-2xl p-3",
          "border border-white/55",
          "bg-gradient-to-b from-white/75 to-white/55",
          "shadow-[0_18px_55px_-45px_rgba(2,6,23,.55)]"
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cx(
              "h-11 w-11 rounded-2xl grid place-items-center",
              "border border-white/60 bg-white/75",
              "shadow-[0_16px_34px_-26px_rgba(2,6,23,.65)]"
            )}
          >
            <span className="text-[12px] font-extrabold text-slate-800">{initialsText}</span>
          </div>

          <div className="min-w-0">
            <div className="text-sm font-extrabold text-slate-900 truncate">{userName}</div>
            <div className="mt-1">
              <span
                className={cx(
                  "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold border",
                  !isAuthed
                    ? "border-slate-200 bg-slate-50 text-slate-700"
                    : roleText === "Administrador"
                    ? "border-amber-200 bg-amber-50 text-amber-800"
                    : "border-sky-200 bg-sky-50 text-sky-800"
                )}
              >
                {roleText}
              </span>
            </div>
          </div>

          <div className="ml-auto hidden sm:grid h-10 w-10 place-items-center rounded-xl border border-white/55 bg-white/60">
            <User size={18} className="text-slate-700" />
          </div>
        </div>
      </div>
    </div>
  )
}

function MenuSections({
  isAuthed,
  userRole,
  onPick,
  onLogout,
}: {
  isAuthed: boolean
  userRole: string
  onPick: () => void
  onLogout: () => void
}) {
  return (
    <div className="grid gap-2">
      {/* Section: Cuenta */}
      <SectionLabel>Cuenta</SectionLabel>

      {!isAuthed ? (
        <MenuLink href="/login" icon={<User size={16} />} onPick={onPick}>
          Iniciar sesión
        </MenuLink>
      ) : (
        <>
          <MenuLink href="/pedidos" icon={<History size={16} />} onPick={onPick}>
            Historial de pedidos
          </MenuLink>

          {/* Estos 2 son “placeholder” visual tipo tu imagen,
              pero si NO tienes esas rutas, bórralos.
              No agregan funcionalidad si no existen.
          */}
          <MenuLink href="/mi-cuenta" icon={<Settings size={16} />} onPick={onPick}>
            Mi perfil
          </MenuLink>

          <MenuLink href="/preferencias" icon={<SlidersHorizontal size={16} />} onPick={onPick}>
            Preferencias
          </MenuLink>

          <MenuLink href="/cambiar-password" icon={<KeyRound size={16} />} onPick={onPick}>
            Cambiar contraseña
          </MenuLink>
        </>
      )}

      {/* Section: Admin */}
      {isAuthed && userRole === "ADMIN" && (
        <>
          <div className="pt-1" />
          <SectionLabel>Admin</SectionLabel>

          <MenuLink href="/admin/productos" icon={<Settings size={16} />} onPick={onPick}>
            Administrar catálogo
          </MenuLink>
        </>
      )}

      {/* Logout */}
      {isAuthed && (
        <button
          type="button"
          onClick={onLogout}
          className={cx(
            "mt-1 flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3",
            "border border-rose-200 bg-gradient-to-r from-rose-500/12 to-white/60",
            "text-rose-800 font-extrabold",
            "hover:shadow-[0_0_24px_rgba(244,63,94,.22)] active:scale-[0.99]"
          )}
        >
          <span className="flex items-center gap-2">
            <LogOut size={16} />
            Cerrar sesión
          </span>
          <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-white/70 border border-white/60">
            Salir
          </span>
        </button>
      )}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-1 pt-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
      {children}
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
        "group flex items-center justify-between gap-3 rounded-2xl px-4 py-3",
        "border border-white/55 bg-white/60 backdrop-blur",
        "shadow-[0_12px_38px_-30px_rgba(2,6,23,.45)]",
        "hover:bg-sky-500/10 hover:shadow-[0_0_22px_rgba(56,189,248,.22)]",
        "active:scale-[0.99]"
      )}
    >
      <span className="flex items-center gap-2">
        <span className="text-slate-700">{icon}</span>
        <span className="text-sm font-extrabold text-slate-900">{children}</span>
      </span>

      <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-white/70 border border-white/60 text-slate-700">
        Ir
      </span>
    </Link>
  )
}