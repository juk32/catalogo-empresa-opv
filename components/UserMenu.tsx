"use client"

import Link from "next/link"
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { User, LogOut, Settings, History } from "lucide-react"

function cx(...s: Array<string | false | null | undefined>) {
  return s.filter(Boolean).join(" ")
}

type BtnRect = { top: number; bottom: number; left: number; right: number }

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

// Rubber band (iOS-like). k controla “resistencia”
function rubberBand(distance: number, dimension: number, k = 0.55) {
  // distance > 0 (arrastrando hacia abajo)
  return (distance * dimension * k) / (dimension + k * distance)
}

export default function UserMenu() {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const btnRef = useRef<HTMLButtonElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)

  const [mounted, setMounted] = useState(false)
  const [btnRect, setBtnRect] = useState<BtnRect>({ top: 0, bottom: 0, left: 0, right: 0 })
  const [panelH, setPanelH] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [preferUp, setPreferUp] = useState(false)

  // Sheet drag state (mobile)
  const [dragY, setDragY] = useState(0)
  const draggingRef = useRef(false)
  const startYRef = useRef(0)
  const startDragRef = useRef(0)
  const sheetScrollRef = useRef<HTMLDivElement | null>(null)

  // ⚠️ Ajusta esto a tu lógica real (auth)
  const userName = "Admin"
  const userRole = "ADMIN"

  useEffect(() => setMounted(true), [])

  // Detecta móvil (sm < 640)
  useEffect(() => {
    const calc = () => setIsMobile(window.innerWidth < 640)
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

  // Recalcular posición al abrir
  useLayoutEffect(() => {
    if (!open) return
    computeBtnRect()
    const raf = requestAnimationFrame(() => computeBtnRect())
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Recalcular en scroll/resize cuando esté abierto
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Medir alto del panel
  useLayoutEffect(() => {
    if (!open) return
    const raf = requestAnimationFrame(() => {
      const h = panelRef.current?.getBoundingClientRect().height ?? 0
      setPanelH(h)
    })
    return () => cancelAnimationFrame(raf)
  }, [open, isMobile])

  // Decide si abre hacia arriba (desktop/tablet)
  useEffect(() => {
    if (!open) return
    if (isMobile) {
      setPreferUp(false)
      return
    }
    const margin = 12
    const spaceBelow = window.innerHeight - btnRect.bottom
    const needsUp = panelH > 0 && spaceBelow < panelH + margin
    setPreferUp(needsUp)
  }, [open, isMobile, btnRect.bottom, panelH])

  // Cerrar click afuera + Escape
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

  // Reset drag on open/close
  useEffect(() => {
    if (open) {
      setDragY(0)
    } else {
      setDragY(0)
    }
  }, [open])

  // ===== Mobile drag handlers =====
  function canDragFromScrollTop() {
    const sc = sheetScrollRef.current
    if (!sc) return true
    return sc.scrollTop <= 0
  }

  function onSheetPointerDown(e: React.PointerEvent) {
    if (!isMobile) return
    // Solo permitir drag si scroll interno está arriba (evita conflicto)
    if (!canDragFromScrollTop()) return

    draggingRef.current = true
    startYRef.current = e.clientY
    startDragRef.current = dragY
    ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
  }

  function onSheetPointerMove(e: React.PointerEvent) {
    if (!isMobile) return
    if (!draggingRef.current) return

    const delta = e.clientY - startYRef.current
    if (delta <= 0) {
      // arrastre hacia arriba: no mover (o muy poquito)
      setDragY(0)
      return
    }

    const dim = Math.max(320, window.innerHeight)
    const rb = rubberBand(delta, dim, 0.6)
    setDragY(rb)
  }

  function onSheetPointerUp() {
    if (!isMobile) return
    if (!draggingRef.current) return
    draggingRef.current = false

    // Umbral: si arrastró bastante, cerrar
    const threshold = Math.max(110, Math.min(180, window.innerHeight * 0.18))
    if (dragY > threshold) {
      setOpen(false)
      return
    }
    // Si no, regresar
    setDragY(0)
  }

  // Estilo desktop/tablet (dropdown pegado al botón)
  const dropdownStyle = useMemo(() => {
    const margin = 12
    const maxW = Math.min(340, Math.floor(window?.innerWidth ? window.innerWidth * 0.92 : 340))

    let left = btnRect.right - maxW
    if (left < margin) left = margin
    if (left + maxW > (window.innerWidth || maxW) - margin) {
      left = (window.innerWidth || maxW) - maxW - margin
    }

    const top = preferUp ? Math.max(margin, btnRect.top - panelH - 10) : Math.max(margin, btnRect.bottom + 10)
    return { left, top, width: maxW }
  }, [btnRect.right, btnRect.bottom, btnRect.top, preferUp, panelH])

  // Overlay opacity reacts to drag (mobile)
  const overlayOpacity = useMemo(() => {
    if (!isMobile) return 1
    // mientras más lo bajas, más transparente
    const t = clamp(1 - dragY / (window.innerHeight * 0.6 || 600), 0.15, 1)
    return t
  }, [dragY, isMobile])

  return (
    <div ref={rootRef} className="relative">
      {/* Botón */}
      <button
        ref={btnRef}
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
        aria-expanded={open}
      >
        <User size={18} className="text-slate-800" />
      </button>

      {/* Portal */}
      {mounted && open
        ? createPortal(
            <>
              {/* Overlay con blur fuerte (click cierra) */}
              <div
                className="fixed inset-0 z-[9998] usermenu-overlay"
                style={{ opacity: overlayOpacity }}
                onClick={() => setOpen(false)}
                aria-hidden="true"
              />

              {/* ===== MOBILE: Bottom Sheet PRO ===== */}
              {isMobile ? (
                <div className="fixed inset-x-0 bottom-0 z-[9999] px-3 pb-3">
                  <div
                    ref={panelRef}
                    className={cx(
                      "usermenu-sheet w-full overflow-hidden rounded-[26px]",
                      "border border-white/55 bg-white/92 backdrop-blur-xl",
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
                    {/* Drag handle (zona de drag) */}
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

                      {/* Head mini */}
                      <div className="px-3 pb-3">
                        <div className="rounded-2xl border border-white/45 bg-white/60 p-3">
                          <div className="text-sm font-bold text-slate-900">{userName}</div>
                          <div className="text-xs text-slate-600">{userRole}</div>
                        </div>
                      </div>
                    </div>

                    {/* Scroll interno (Apple feel) */}
                    <div
                      ref={sheetScrollRef}
                      className="px-3 pb-3 overflow-y-auto"
                      style={{ maxHeight: "calc(84vh - 112px)" }}
                    >
                      <div className="grid gap-1">
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

                      {/* pequeño “fade” al final */}
                      <div className="pointer-events-none sticky bottom-0 h-10 bg-gradient-to-t from-white/90 to-transparent" />
                    </div>
                  </div>

                  <style>{`
                    /* Overlay blur pro */
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
                    .usermenu-sheet{
                      animation: sheetIn 180ms ease-out both;
                    }

                    @media (prefers-reduced-motion: reduce) {
                      .usermenu-sheet { animation: none !important; }
                      .usermenu-overlay { transition: none !important; }
                    }
                  `}</style>
                </div>
              ) : (
                /* ===== DESKTOP/TABLET: Dropdown + Flip ===== */
                <div
                  ref={panelRef}
                  className={cx(
                    "fixed z-[9999]",
                    "w-[min(92vw,340px)] overflow-hidden",
                    "rounded-2xl border border-white/40 bg-white/90 backdrop-blur-xl",
                    "shadow-[0_40px_120px_-70px_rgba(0,0,0,.9)]",
                    preferUp ? "origin-bottom-right" : "origin-top-right",
                    "menu-in"
                  )}
                  style={{
                    top: dropdownStyle.top,
                    left: dropdownStyle.left,
                    width: dropdownStyle.width,
                  }}
                  role="dialog"
                  aria-modal="true"
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

                  <style>{`
                    @keyframes menuInDown {
                      from { opacity: 0; transform: translateY(-8px) scale(.985); }
                      to   { opacity: 1; transform: translateY(0) scale(1); }
                    }
                    @keyframes menuInUp {
                      from { opacity: 0; transform: translateY(8px) scale(.985); }
                      to   { opacity: 1; transform: translateY(0) scale(1); }
                    }
                    .menu-in { animation: ${preferUp ? "menuInUp" : "menuInDown"} 160ms ease-out both; }

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
