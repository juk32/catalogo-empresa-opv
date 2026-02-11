"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

function safeImageSrc(src: string | null | undefined) {
  if (!src) return "/placeholder.png"
  if (src.startsWith("/") || src.startsWith("http")) return src
  return "/placeholder.png"
}

export default function ZoomImage({
  src,
  alt,
}: {
  src: string | null | undefined
  alt: string
}) {
  const s = safeImageSrc(src)

  const boxRef = useRef<HTMLDivElement | null>(null)
  const lensRef = useRef<HTMLDivElement | null>(null)
  const resultRef = useRef<HTMLDivElement | null>(null)

  const [open, setOpen] = useState(false)

  useEffect(() => {
    const box = boxRef.current
    const lens = lensRef.current
    const result = resultRef.current

    // ✅ guard: si algo no existe, no hacemos nada
    if (!box || !lens || !result) return

    // background-size 240% => zoom aproximado 2.4
    result.style.backgroundImage = `url(${s})`
    result.style.backgroundSize = "240%"
    result.style.backgroundRepeat = "no-repeat"

    const onMove = (e: MouseEvent) => {
      const r = box.getBoundingClientRect()
      const x = Math.min(Math.max(0, e.clientX - r.left), r.width)
      const y = Math.min(Math.max(0, e.clientY - r.top), r.height)

      const lensW = lens.offsetWidth
      const lensH = lens.offsetHeight

      lens.style.left = `${x - lensW / 2}px`
      lens.style.top = `${y - lensH / 2}px`

      const bgX = (x / r.width) * 100
      const bgY = (y / r.height) * 100
      result.style.backgroundPosition = `${bgX}% ${bgY}%`
    }

    box.addEventListener("mousemove", onMove)
    return () => box.removeEventListener("mousemove", onMove)
  }, [s])

  return (
    <>
      {/* Frame + zoom */}
      <div className="relative mt-4 overflow-hidden rounded-2xl border border-white/45 bg-white/60">
        <div ref={boxRef} className="relative h-80 w-full">
          {/* Fondo elegante */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/75 via-slate-50/40 to-slate-200/30" />
          <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(circle_at_30%_20%,rgba(56,189,248,.18),transparent_55%),radial-gradient(circle_at_70%_80%,rgba(244,63,94,.14),transparent_55%)]" />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-white/50 shadow-[inset_0_1px_0_rgba(255,255,255,.25)]" />

          <Image src={s} alt={alt} fill className="object-contain p-6" priority />

          {/* Desktop lens */}
          <div className="absolute inset-0 hidden md:block">
            <div ref={lensRef} className="zoom-lens" />
            <div ref={resultRef} className="zoom-result" aria-hidden="true" />
          </div>

          {/* Botón zoom (móvil/tablet) */}
          <button
            type="button"
            className="md:hidden absolute bottom-3 right-3 rounded-2xl border border-white/45 bg-white/70 px-3 py-2 text-xs font-semibold text-slate-900 backdrop-blur active:scale-[0.98]"
            onClick={() => setOpen(true)}
          >
            🔍 Zoom
          </button>
        </div>
      </div>

      {/* Modal simple (móvil/tablet) */}
      {open && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-black/45 p-4 backdrop-blur-sm">
          <div className="w-[min(92vw,980px)] overflow-hidden rounded-3xl border border-white/40 bg-white/85 shadow-[0_40px_120px_-70px_rgba(0,0,0,.9)]">
            <div className="flex items-center justify-between gap-3 border-b border-white/40 bg-white/70 px-4 py-3">
              <div className="truncate text-sm font-semibold text-slate-900">{alt}</div>
              <button
                className="rounded-xl border border-white/45 bg-white/75 px-3 py-1 text-xs font-semibold text-slate-900 hover:bg-white/90"
                onClick={() => setOpen(false)}
              >
                Cerrar ✕
              </button>
            </div>

            <div className="relative h-[70vh] bg-white/60">
              <Image src={s} alt={alt} fill className="object-contain p-4" />
            </div>

            <div className="px-4 py-3 text-xs text-slate-700">
              Tip: en tablet/móvil puedes hacer <b>pinch zoom</b> sobre la imagen.
            </div>
          </div>
        </div>
      )}

      {/* CSS lupa */}
      <style jsx>{`
        .zoom-lens {
          position: absolute;
          width: 130px;
          height: 130px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.65);
          box-shadow: 0 20px 50px -30px rgba(0, 0, 0, 0.8);
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(10px);
          opacity: 0;
          transform: scale(0.96);
          transition: opacity 0.15s ease, transform 0.15s ease;
          pointer-events: none;
        }

        .zoom-result {
          position: absolute;
          right: 14px;
          bottom: 14px;
          width: 180px;
          height: 180px;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 30px 80px -50px rgba(0, 0, 0, 0.75);
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.15s ease, transform 0.15s ease;
          pointer-events: none;
          background-color: rgba(255, 255, 255, 0.25);
        }

        /* mostrar al hover en desktop */
        @media (hover: hover) and (pointer: fine) {
          :global(.group:hover) .zoom-lens,
          :global(.group:hover) .zoom-result {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </>
  )
}
