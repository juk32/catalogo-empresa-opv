"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useRef, useState } from "react"

function safeImageSrc(src: string | null | undefined) {
  if (!src) return "/placeholder.png"
  if (src.startsWith("/") || src.startsWith("http")) return src
  return "/placeholder.png"
}

function formatMoney(n: number) {
  return n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function ProductCard3D(props: {
  id: string
  name: string
  category: string
  image: string
  description: string
  price: number
  stock: number
  href: string
}) {
  const out = (props.stock ?? 0) <= 0
  const ref = useRef<HTMLDivElement | null>(null)

  // rotate (card)
  const [rx, setRx] = useState(0)
  const [ry, setRy] = useState(0)

  // glow position (%)
  const [gx, setGx] = useState(50)
  const [gy, setGy] = useState(20)

  // parallax inside (px)
  const [ix, setIx] = useState(0)
  const [iy, setIy] = useState(0)

  const [hover, setHover] = useState(false)

  const stars = useMemo(() => "★★★★★", [])

  function onMove(e: React.MouseEvent) {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width // 0..1
    const py = (e.clientY - r.top) / r.height // 0..1

    // Card rotation (más 3D)
    const maxRot = 12
    const nextRy = (px - 0.5) * (maxRot * 2) // -12..12
    const nextRx = -(py - 0.5) * (maxRot * 2)

    // Glow
    setGx(px * 100)
    setGy(py * 100)

    // Inner parallax (la imagen se mueve distinto)
    // rango aprox 10px
    const maxInner = 10
    setIx((px - 0.5) * (maxInner * 2))
    setIy((py - 0.5) * (maxInner * 2))

    setRx(nextRx)
    setRy(nextRy)
  }

  function reset() {
    setRx(0)
    setRy(0)
    setGx(50)
    setGy(20)
    setIx(0)
    setIy(0)
    setHover(false)
  }

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={reset}
      onMouseMove={onMove}
      className="group relative rounded-[28px] transition-all duration-300"
      style={{
        transform: `perspective(1300px) rotateX(${rx}deg) rotateY(${ry}deg)`,
        transformStyle: "preserve-3d",
      }}
    >
      {/* 1) sombra base blur (profundidad) */}
      <div
        className="absolute -inset-2 rounded-[32px] opacity-70 blur-2xl"
        style={{
          background:
            "radial-gradient(700px circle at 30% 10%, rgba(56,189,248,0.22), transparent 45%), radial-gradient(650px circle at 85% 15%, rgba(244,63,94,0.18), transparent 50%), radial-gradient(650px circle at 50% 95%, rgba(2,6,23,0.12), transparent 55%)",
        }}
      />

      {/* 2) card real */}
      <div
        className={[
          "relative rounded-[28px] border bg-white/90 p-4 backdrop-blur",
          "shadow-[0_18px_60px_rgba(2,6,23,0.18)]",
          "transition-all duration-300",
          "group-hover:shadow-[0_30px_95px_rgba(2,6,23,0.26)]",
          out ? "opacity-95" : "",
        ].join(" ")}
        style={{
          transform: "translateZ(0px)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* 3) Rim light (borde brillante tipo vidrio) */}
        <div className="pointer-events-none absolute inset-0 rounded-[28px]">
          <div
            className="absolute inset-0 rounded-[28px] opacity-90"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.85), rgba(255,255,255,0.22) 45%, rgba(255,255,255,0.06))",
              maskImage:
                "radial-gradient(1200px circle at 0% 0%, black 35%, transparent 65%)",
            }}
          />
          {/* borde interno sutil */}
          <div className="absolute inset-0 rounded-[28px] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]" />
        </div>

        {/* 4) Glow que sigue el cursor */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[28px] opacity-0 transition-opacity duration-200"
          style={{
            opacity: hover ? 1 : 0,
            background: `radial-gradient(520px circle at ${gx}% ${gy}%, rgba(56,189,248,0.22), transparent 58%),
                         radial-gradient(480px circle at ${Math.min(100, gx + 18)}% ${Math.max(0, gy - 12)}%, rgba(244,63,94,0.18), transparent 62%)`,
          }}
        />

        {/* 5) Glass reflection sweep (barrido de brillo) */}
        <div
          className={[
            "pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          ].join(" ")}
          style={{ transform: "translateZ(55px)" }}
        >
          <div
            className={[
              "absolute -left-1/2 top-0 h-full w-[200%]",
              "bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.35),transparent)]",
              "translate-x-[-60%] group-hover:translate-x-[60%]",
              "transition-transform duration-700 ease-out",
            ].join(" ")}
          />
        </div>

        {/* stock badge */}
        {out ? (
          <span
            className="absolute right-4 top-4 z-10 rounded-full bg-rose-600 px-2.5 py-1 text-xs font-bold text-white shadow"
            style={{ transform: "translateZ(65px)" }}
          >
            Sin stock
          </span>
        ) : (
          <span
            className="absolute right-4 top-4 z-10 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800"
            style={{ transform: "translateZ(65px)" }}
          >
            En stock
          </span>
        )}

        {/* IMAGE BLOCK (con parallax interno) */}
        <div
          className="relative mb-4 h-44 overflow-hidden rounded-2xl border bg-white"
          style={{ transform: "translateZ(45px)" }}
        >
          <div
            className="absolute inset-0"
            style={{
              transform: `translate3d(${ix}px, ${iy}px, 0)`,
              transition: hover ? "none" : "transform 250ms ease",
            }}
          >
            <Image
              src={safeImageSrc(props.image)}
              alt={props.name}
              fill
              className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.10]"
            />
          </div>

          {/* depth shading */}
          <div className="pointer-events-none absolute inset-0 shadow-[inset_0_-26px_46px_rgba(2,6,23,0.14)]" />
          <div className="pointer-events-none absolute inset-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]" />
        </div>

        {/* TEXT LAYER (también “sale” un poco) */}
        <div className="space-y-1" style={{ transform: "translateZ(34px)" }}>
          <h2 className="text-base font-semibold leading-tight text-slate-900">
            {props.name}
          </h2>

          <div className="flex items-end justify-between gap-3">
            <div className="text-lg font-bold text-slate-900">
              ${formatMoney(props.price)}
            </div>
            <p className="text-xs text-slate-500">{props.category}</p>
          </div>

          <p className="mt-1 line-clamp-2 text-sm text-slate-600">
            {props.description}
          </p>

          <div className="text-xs text-amber-500/80">{stars}</div>
        </div>

        {/* BUTTON LAYER */}
        <Link
          href={props.href}
          aria-disabled={out}
          className={[
            "mt-4 block rounded-2xl py-2 text-center text-sm font-semibold text-white shadow",
            "bg-gradient-to-r from-sky-500 to-rose-500 hover:brightness-95 transition",
            out ? "pointer-events-none opacity-50" : "",
          ].join(" ")}
          style={{ transform: "translateZ(62px)" }}
        >
          Ver detalle
        </Link>

        <div
          className="mt-2 text-center text-[11px] text-slate-400"
          style={{ transform: "translateZ(20px)" }}
        >
          {props.id}
        </div>
      </div>
    </div>
  )
}

