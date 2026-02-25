"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import QRCode from "react-qr-code"
import { QrCode, Share2, Copy, MessageCircle, Mail, Pencil, X, ExternalLink } from "lucide-react"

function cx(...s: Array<string | false | null | undefined>) {
  return s.filter(Boolean).join(" ")
}

function baseUrl() {
  if (typeof window === "undefined") return ""
  return window.location.origin
}

export default function QrInlineActions({
  productId,
  productName,
  className,
}: {
  productId: string
  productName: string
  className?: string
}) {
  const { status } = useSession()
  const isLoggedIn = status === "authenticated"

  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const qrPath = useMemo(() => `/qr/producto/${encodeURIComponent(productId)}`, [productId])
  const qrUrl = useMemo(() => `${baseUrl()}${qrPath}`, [qrPath])

  const productPath = useMemo(() => `/producto/${encodeURIComponent(productId)}`, [productId])
  const productUrl = useMemo(() => `${baseUrl()}${productPath}`, [productPath])

  const editPath = useMemo(
    () => `/agregar-productos/${encodeURIComponent(productId)}/editar`,
    [productId]
  )
  const loginWithReturn = useMemo(
    () => `/login?callbackUrl=${encodeURIComponent(editPath)}`,
    [editPath]
  )

  const waUrl = useMemo(() => {
    const text = encodeURIComponent(`Mira este producto: ${productUrl}`)
    return `https://wa.me/?text=${text}`
  }, [productUrl])

  const gmailUrl = useMemo(() => {
    const subject = encodeURIComponent(`Producto - ${productName}`)
    const body = encodeURIComponent(`Te comparto este producto:\n${productUrl}`)
    return `mailto:?subject=${subject}&body=${body}`
  }, [productName, productUrl])

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
        await navigator.share({ title: productName, url: productUrl })
      } else {
        await copyLink()
      }
    } catch {}
  }

  return (
    <>
      <div className={cx("flex flex-wrap gap-2", className)}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/55 bg-white/70 px-3 py-2 text-sm font-semibold text-slate-900 backdrop-blur hover:bg-white/85"
        >
          <QrCode className="h-4 w-4" />
          QR
        </button>

        <button
          type="button"
          onClick={nativeShare}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/55 bg-white/70 px-3 py-2 text-sm font-semibold text-slate-900 backdrop-blur hover:bg-white/85"
        >
          <Share2 className="h-4 w-4" />
          Compartir
        </button>

        {isLoggedIn ? (
          <Link
            href={editPath}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/55 bg-white/70 px-3 py-2 text-sm font-semibold text-slate-900 backdrop-blur hover:bg-white/85"
          >
            <Pencil className="h-4 w-4" />
            Editar
          </Link>
        ) : (
          <Link
            href={loginWithReturn}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/55 bg-white/60 px-3 py-2 text-sm font-semibold text-slate-600 backdrop-blur hover:bg-white/75"
            title="Inicia sesión para editar"
          >
            <Pencil className="h-4 w-4" />
            Editar
          </Link>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-[80]">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setOpen(false)} />

          <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2">
            <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 shadow-[0_30px_90px_-45px_rgba(2,6,23,.55)] backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-900">QR del producto</div>
                  <div className="truncate text-xs text-slate-600">{productName}</div>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl border border-slate-200 bg-white/70 p-2 hover:bg-white"
                  aria-label="Cerrar"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="px-4 pb-4">
                <div className="grid place-items-center rounded-3xl border border-slate-200 bg-white p-5">
                  <QRCode value={qrUrl || qrPath} size={190} />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <a
                    href={waUrl}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/70 px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-white"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>

                  <a
                    href={gmailUrl}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/70 px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-white"
                  >
                    <Mail className="h-4 w-4" />
                    Gmail
                  </a>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    onClick={copyLink}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/70 px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-white"
                  >
                    <Copy className="h-4 w-4" />
                    {copied ? "Copiado" : "Copiar link"}
                  </button>

                  <Link
                    href={productPath}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/70 px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-white"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Ver producto
                  </Link>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Link
                    href={qrPath}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/70 px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-white"
                  >
                    <QrCode className="h-4 w-4" />
                    Abrir QR
                  </Link>

                  {isLoggedIn ? (
                    <Link
                      href={editPath}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      <Pencil className="h-4 w-4" />
                      Editar
                    </Link>
                  ) : (
                    <Link
                      href={loginWithReturn}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      <Pencil className="h-4 w-4" />
                      Login y editar
                    </Link>
                  )}
                </div>

                <p className="mt-2 text-[11px] text-slate-600">
                  El QR abre la ventana de acciones. Editar solo con sesión.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}