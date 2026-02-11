"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

type Product = {
  id: string
  name: string
  price: number
  category: string
  image: string
  description: string
  details: any
  rating: number
  stock: number
}

type Ctx = {
  params: Promise<{ id: string }>
}

/* =========================
   Modal / Toast animado (incrustado)
========================= */
function ToastModal({
  open,
  title,
  message,
  variant = "success",
  onClose,
}: {
  open: boolean
  title: string
  message?: string
  variant?: "success" | "error" | "info"
  onClose: () => void
}) {
  if (!open) return null

  const ring =
    variant === "success"
      ? "ring-emerald-200"
      : variant === "error"
      ? "ring-rose-200"
      : "ring-sky-200"

  const badge =
    variant === "success"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : variant === "error"
      ? "bg-rose-50 text-rose-700 border-rose-200"
      : "bg-sky-50 text-sky-700 border-sky-200"

  return (
    <div className="fixed inset-0 z-[110] flex items-start justify-center px-4 pt-6">
      {/* Fondo suave */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Tarjeta */}
      <div
        className={`relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl ring-1 ${ring}
        animate-in fade-in zoom-in duration-200`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${badge}`}>
              {variant === "success" ? "Listo" : variant === "error" ? "Error" : "Info"}
            </div>

            <h3 className="mt-2 text-base font-bold text-slate-900">{title}</h3>
            {message ? <p className="mt-1 text-sm text-slate-600">{message}</p> : null}
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border px-3 py-1.5 text-sm font-semibold hover:bg-slate-50"
            aria-label="Cerrar"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  )
}

export default function EditarProductoPage({ params }: Ctx) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement | null>(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState("")

  const [p, setP] = useState<Product | null>(null)

  // ✅ modal state
  const [toastOpen, setToastOpen] = useState(false)
  const [toastTitle, setToastTitle] = useState("")
  const [toastMsg, setToastMsg] = useState<string | undefined>(undefined)
  const [toastVariant, setToastVariant] = useState<"success" | "error" | "info">("success")

  function showToast(v: "success" | "error" | "info", title: string, msg?: string) {
    setToastVariant(v)
    setToastTitle(title)
    setToastMsg(msg)
    setToastOpen(true)

    // autoclose
    window.clearTimeout((showToast as any)._t)
    ;(showToast as any)._t = window.setTimeout(() => setToastOpen(false), 1600)
  }

  /* =========================
     Cargar producto
  ========================= */
  async function load() {
    const { id } = await params
    setLoading(true)

    try {
      const res = await fetch(`/api/products/${encodeURIComponent(id)}`, {
        cache: "no-store",
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        showToast("error", "No se pudo cargar", data?.error || "Producto no encontrado")
        router.push("/admin/productos")
        return
      }

      setP(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* =========================
     Subir imagen
  ========================= */
  async function uploadImage(file: File) {
    const fd = new FormData()
    fd.append("file", file)

    const res = await fetch("/api/upload", {
      method: "POST",
      body: fd,
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data?.error || "No se pudo subir imagen")

    return data.url as string
  }

  async function pickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !p) return

    setPreview(URL.createObjectURL(file))
    setUploading(true)

    try {
      const url = await uploadImage(file)
      setP({ ...p, image: url })
      showToast("success", "Imagen actualizada")
    } catch (err: any) {
      showToast("error", "Error subiendo imagen", err?.message || "Intenta de nuevo")
      e.target.value = ""
      setPreview("")
    } finally {
      setUploading(false)
    }
  }

  /* =========================
     Guardar cambios
  ========================= */
  async function save() {
    if (!p) return
    setSaving(true)

    try {
      const res = await fetch(`/api/products/${encodeURIComponent(p.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: p.name,
          price: p.price,
          category: p.category,
          image: p.image,
          description: p.description,
          details: Array.isArray(p.details)
            ? p.details
            : String(p.details || "")
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean),
          rating: p.rating,
          stock: p.stock,
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        showToast("error", "No se pudo guardar", data?.error || "Error")
        return
      }

      showToast("success", "Producto actualizado ✅")
      // opcional: regresar al admin
      router.push("/admin/productos")
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-6">Cargando...</div>
  if (!p) return <div className="p-6">Producto no encontrado</div>

  return (
    <>
      <div className="mx-auto max-w-2xl p-6 space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Editar producto</h1>
          <p className="text-sm text-slate-600">{p.id}</p>
        </div>

        <input
          className="rounded-xl border p-3"
          value={p.name}
          onChange={(e) => setP({ ...p, name: e.target.value })}
          placeholder="Nombre"
        />

        <input
          className="rounded-xl border p-3"
          value={p.category}
          onChange={(e) => setP({ ...p, category: e.target.value })}
          placeholder="Categoría"
        />

        <input
          className="rounded-xl border p-3"
          type="number"
          value={p.price}
          onChange={(e) => setP({ ...p, price: Number(e.target.value) })}
          placeholder="Precio"
        />

        <input
          className="rounded-xl border p-3"
          type="number"
          value={p.stock}
          onChange={(e) => setP({ ...p, stock: Number(e.target.value) })}
          placeholder="Stock"
        />

        {/* Imagen */}
        <div className="rounded-xl border p-3">
          <p className="text-sm font-semibold">Imagen</p>

          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={pickImage}
            disabled={uploading || saving}
          />

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading || saving}
            className="mt-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {uploading ? "Subiendo..." : "Cambiar imagen"}
          </button>

          {(preview || p.image) && (
            <div className="mt-3 overflow-hidden rounded-xl border bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview || p.image} alt="imagen" className="h-48 w-full object-contain" />
            </div>
          )}
        </div>

        <textarea
          className="rounded-xl border p-3"
          value={p.description}
          onChange={(e) => setP({ ...p, description: e.target.value })}
          placeholder="Descripción"
        />

        <textarea
          className="rounded-xl border p-3"
          value={Array.isArray(p.details) ? p.details.join("\n") : String(p.details || "")}
          onChange={(e) => setP({ ...p, details: e.target.value })}
          placeholder="Detalles (uno por línea)"
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            className="rounded-xl border p-3"
            type="number"
            value={p.rating}
            onChange={(e) => setP({ ...p, rating: Number(e.target.value) })}
            placeholder="Rating"
          />

          <button
            type="button"
            onClick={save}
            disabled={saving || uploading}
            className="rounded-xl bg-black px-4 py-3 font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>

      {/* ✅ Modal animado */}
      <ToastModal
        open={toastOpen}
        title={toastTitle}
        message={toastMsg}
        variant={toastVariant}
        onClose={() => setToastOpen(false)}
      />
    </>
  )
}
