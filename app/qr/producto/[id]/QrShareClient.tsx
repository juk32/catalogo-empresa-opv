"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import QRCode from "react-qr-code"
import { Copy, Share2, Mail, MessageCircle, ExternalLink, Download, Pencil, Lock } from "lucide-react"

function baseUrl() {
  if (typeof window === "undefined") return ""
  return window.location.origin
}

export default function QrShareClient({ id, isLoggedIn }: { id: string; isLoggedIn: boolean }) {
  const [copied, setCopied] = useState(false)

  // ✅ Detalle público del producto (ajusta si tu ruta es diferente)
  const productPath = useMemo(() => `/productos/${id}`, [id])
  const productUrl = useMemo(() => `${baseUrl()}${productPath}`, [productPath])

  // ✅ Tu ruta real de editar (según tu carpeta app/agregar-productos/[id]/editar/page.tsx)
  const editPath = useMemo(() => `/agregar-productos/${id}/editar`, [id])

  // ✅ Si no hay sesión, manda a login y regresa a editar
  const loginWithReturn = useMemo(
    () => `/login?callbackUrl=${encodeURIComponent(editPath)}`,
    [editPath]
  )

  const waUrl = useMemo(() => {
    const text = encodeURIComponent(`Mira este producto: ${productUrl}`)
    return `https://wa.me/?text=${text}`
  }, [productUrl])

  const gmailUrl = useMemo(() => {
    const subject = encodeURIComponent("Producto - Operadora Balles")
    const body = encodeURIComponent(`Te comparto este producto:\n${productUrl}`)
    return `mailto:?subject=${subject}&body=${body}`
  }, [productUrl])

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(productUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {}
  }

  async function nativeShare() {
    try {
      if (navigator.share) {
        await navigator.share({ title: "Producto", url: productUrl })
      } else {
        await copyLink()
      }
    } catch {}
  }

  function downloadQrSvg() {
    const svg = document.querySelector("#qr-svg") as SVGSVGElement | null
    if (!svg) return
    const serializer = new XMLSerializer()
    const source = serializer.serializeToString(svg)
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `qr-producto-${id}.svg`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/70 p-5 shadow-[0_18px_60px_-35px_rgba(2,6,23,.35)] backdrop-blur-xl">
        <div className="pointer-events-none absolute -top-24 left-10 h-56 w-56 rounded-full bg-sky-300/25 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-24 right-10 h-56 w-56 rounded-full bg-indigo-300/25 blur-[90px]" />

        <div className="mb-3">
          <div className="text-sm font-semibold text-slate-900">Acciones del producto</div>
          <div className="text-xs text-slate-600">Escaneaste un QR. Elige qué quieres hacer.</div>
        </div>

        <div className="grid place-items-center rounded-2xl border border-slate-200 bg-white p-5">
          <QRCode id="qr-svg" value={productUrl || productPath} size={190} />
        </div>

        <div className="mt-3 flex flex-col gap-2">
          <Link
            href={productPath}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <ExternalLink className="h-4 w-4" />
            Ver producto
          </Link>

          {isLoggedIn ? (
            <Link
              href={editPath}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-white"
            >
              <Pencil className="h-4 w-4" />
              Editar producto
            </Link>
          ) : (
            <Link
              href={loginWithReturn}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/60 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-white"
              title="Inicia sesión para editar"
            >
              <Lock className="h-4 w-4" />
              Editar (requiere login)
            </Link>
          )}

          <div className="grid grid-cols-2 gap-2">
            <a
              href={waUrl}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-white"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>

            <a
              href={gmailUrl}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-white"
            >
              <Mail className="h-4 w-4" />
              Gmail
            </a>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={copyLink}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-white"
            >
              <Copy className="h-4 w-4" />
              {copied ? "Copiado" : "Copiar link"}
            </button>

            <button
              onClick={nativeShare}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-white"
            >
              <Share2 className="h-4 w-4" />
              Compartir
            </button>
          </div>

          <button
            onClick={downloadQrSvg}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-white"
          >
            <Download className="h-4 w-4" />
            Descargar QR
          </button>
        </div>
      </div>
    </div>
  )
}