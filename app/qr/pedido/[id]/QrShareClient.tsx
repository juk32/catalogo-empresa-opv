"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

function cx(...s: Array<string | false | null | undefined>) {
  return s.filter(Boolean).join(" ")
}

export default function QrShareClient({ id }: { id: string }) {
  const router = useRouter()
  const { status } = useSession()
  const isAuthed = status === "authenticated"

  // ✅ links reales
  const baseUrl = useMemo(() => {
    if (typeof window === "undefined") return ""
    return window.location.origin
  }, [])

  const pdfUrl = `${baseUrl}/api/pedido/pdf?id=${encodeURIComponent(id)}`
  const deliverUrl = `/pedidos?deliver=${encodeURIComponent(id)}`
  const editUrl = `/pedidos/${encodeURIComponent(id)}`
  const callbackBackHere = `/qr/pedido/${encodeURIComponent(id)}`

  async function shareNative() {
    try {
      if (!navigator.share) return false
      await navigator.share({
        title: "Pedido Operadora Balles",
        text: `Pedido ${id}`,
        url: `${baseUrl}/qr/pedido/${encodeURIComponent(id)}`,
      })
      return true
    } catch {
      return false
    }
  }

  function openWhatsApp() {
    const msg = encodeURIComponent(`Pedido: ${id}\nPDF: ${pdfUrl}`)
    window.open(`https://wa.me/?text=${msg}`, "_blank")
  }

  function openMail() {
    const subject = encodeURIComponent(`Pedido ${id} - Operadora Balles`)
    const body = encodeURIComponent(`Hola,\n\nTe comparto el pedido ${id}.\nPDF: ${pdfUrl}\n\nSaludos.`)
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  function goPrivate(target: "deliver" | "edit") {
    if (!isAuthed) {
      router.push(`/login?callbackUrl=${encodeURIComponent(callbackBackHere)}`)
      return
    }
    router.push(target === "deliver" ? deliverUrl : editUrl)
  }

  // ✅ si ya se logueó y venía por callback, aquí NO redirigimos solos;
  // el usuario decide qué hacer.
  useEffect(() => {}, [])

  return (
    <section className="relative min-h-[calc(100vh-160px)] flex items-center justify-center p-4">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute -top-44 left-1/2 h-[520px] w-[940px] -translate-x-1/2 rounded-full bg-sky-200/30 blur-[140px]" />
        <div className="absolute top-12 right-[-220px] h-[520px] w-[520px] rounded-full bg-rose-200/22 blur-[150px]" />
        <div className="absolute bottom-[-240px] left-[-240px] h-[640px] w-[640px] rounded-full bg-indigo-200/18 blur-[170px]" />
      </div>

      <div className="w-full max-w-xl rounded-3xl border border-white/60 bg-white/65 backdrop-blur-xl shadow-[0_24px_70px_-55px_rgba(15,23,42,.55)] overflow-hidden">
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[11px] font-extrabold text-slate-600">Acciones QR</div>
              <h1 className="mt-1 text-xl sm:text-2xl font-extrabold text-slate-900">Pedido</h1>
              <div className="mt-1 text-sm text-slate-700">
                ID: <span className="font-mono">{id}</span>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Puedes compartir el PDF o entrar a acciones administrativas (requiere login).
              </div>
            </div>

            <Link
              href="/pedidos"
              className="shrink-0 rounded-2xl border border-white/70 bg-white/70 px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-white transition"
            >
              Ir a pedidos
            </Link>
          </div>

          {/* acciones */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              onClick={shareNative}
              className={cx(
                "rounded-2xl px-4 py-3 text-sm font-semibold",
                "border border-white/70 bg-white/70 hover:bg-white transition"
              )}
            >
              Compartir (Share)
              <div className="mt-1 text-xs text-slate-500">Menú nativo del teléfono</div>
            </button>

            <button
              onClick={openWhatsApp}
              className={cx(
                "rounded-2xl px-4 py-3 text-sm font-semibold text-white",
                "bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 hover:brightness-95 transition"
              )}
            >
              Enviar por WhatsApp
              <div className="mt-1 text-xs text-white/85">Incluye link al PDF</div>
            </button>

            <button
              onClick={openMail}
              className={cx(
                "rounded-2xl px-4 py-3 text-sm font-semibold",
                "border border-white/70 bg-white/70 hover:bg-white transition"
              )}
            >
              Enviar por correo
              <div className="mt-1 text-xs text-slate-500">Abre mailto con el link</div>
            </button>

            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              className={cx(
                "rounded-2xl px-4 py-3 text-sm font-semibold",
                "border border-white/70 bg-white/70 hover:bg-white transition block"
              )}
            >
              Ver / Descargar PDF
              <div className="mt-1 text-xs text-slate-500">Abre el PDF directo</div>
            </a>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => goPrivate("deliver")}
              className={cx(
                "rounded-2xl px-4 py-3 text-sm font-semibold text-white",
                "bg-gradient-to-r from-sky-600 via-indigo-600 to-rose-600 hover:brightness-95 transition"
              )}
            >
              Entregar pedido
              <div className="mt-1 text-xs text-white/85">{isAuthed ? "Abre el modal" : "Requiere login"}</div>
            </button>

            <button
              onClick={() => goPrivate("edit")}
              className={cx(
                "rounded-2xl px-4 py-3 text-sm font-semibold",
                "border border-white/70 bg-white/70 hover:bg-white transition"
              )}
            >
              Editar pedido
              <div className="mt-1 text-xs text-slate-500">{isAuthed ? "Ir al detalle" : "Requiere login"}</div>
            </button>
          </div>

          {!isAuthed ? (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Para <b>Entregar</b> o <b>Editar</b> necesitas iniciar sesión.
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}