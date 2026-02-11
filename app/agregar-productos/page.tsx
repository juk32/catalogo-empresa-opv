"use client"

import { useRef, useState, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"

/* =========================
   ToastModal incrustado (animado)
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
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div
        className={`relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl ring-1 ${ring}
        animate-in fade-in zoom-in duration-200`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${badge}`}
            >
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

type ProductInput = {
  id: string
  name: string
  price: number
  category: string
  image: string
  description: string
  details: string
  rating: number
  stock: number
}

export default function AgregarProductosPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement | null>(null)

  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState("")

  const [form, setForm] = useState<ProductInput>({
    id: "",
    name: "",
    price: 0,
    category: "",
    image: "",
    description: "",
    details: "",
    rating: 4.5,
    stock: 0,
  })

  const [toastOpen, setToastOpen] = useState(false)
  const [toastTitle, setToastTitle] = useState("")
  const [toastMsg, setToastMsg] = useState<string | undefined>(undefined)
  const [toastVariant, setToastVariant] = useState<"success" | "error" | "info">("success")

  function showToast(v: "success" | "error" | "info", title: string, msg?: string) {
    setToastVariant(v)
    setToastTitle(title)
    setToastMsg(msg)
    setToastOpen(true)

    window.clearTimeout((showToast as any)._t)
    ;(showToast as any)._t = window.setTimeout(() => setToastOpen(false), 2500)
  }

  async function uploadImage(file: File) {
    const fd = new FormData()
    fd.append("file", file)

    const res = await fetch("/api/upload", { method: "POST", body: fd })
    const data = await res.json().catch(() => ({}))

    if (!res.ok) throw new Error((data as any)?.error || "No se pudo subir imagen")
    return (data as any).url as string
  }

  async function pickImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setPreview(URL.createObjectURL(file))
    setUploading(true)

    try {
      const url = await uploadImage(file)
      setForm((prev) => ({ ...prev, image: url }))
      showToast("success", "Imagen subida ✅")
    } catch (err: any) {
      const msg =
        typeof err?.message === "string" ? err.message.split("\n")[0].slice(0, 140) : "Intenta de nuevo"
      showToast("error", "Error subiendo imagen", msg)

      e.target.value = ""
      setPreview("")
      setForm((prev) => ({ ...prev, image: "" }))
    } finally {
      setUploading(false)
    }
  }

  async function save() {
    if (!form.id.trim()) return showToast("error", "Falta ID", "Es obligatorio.")
    if (!form.name.trim()) return showToast("error", "Falta nombre", "Es obligatorio.")
    if (!form.category.trim()) return showToast("error", "Falta categoría", "Es obligatorio.")

    setSaving(true)
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          details: form.details
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        showToast("error", "No se pudo guardar", (data as any)?.error || "Error")
        return
      }

      showToast("success", "Producto agregado ✅")
      router.refresh()

      setForm({
        id: "",
        name: "",
        price: 0,
        category: "",
        image: "",
        description: "",
        details: "",
        rating: 4.5,
        stock: 0,
      })
      setPreview("")
      if (fileRef.current) fileRef.current.value = ""
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="mx-auto max-w-2xl p-6 space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Agregar producto</h1>
          <p className="text-sm text-slate-600">Crea un producto nuevo en el catálogo.</p>
        </div>

        <input
          className="rounded-xl border p-3"
          value={form.id}
          onChange={(e) => setForm({ ...form, id: e.target.value })}
          placeholder="ID (ej: LECH-LACT-214)"
        />

        <input
          className="rounded-xl border p-3"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Nombre"
        />

        <input
          className="rounded-xl border p-3"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          placeholder="Categoría"
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            className="rounded-xl border p-3"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            placeholder="Precio"
          />

          <input
            className="rounded-xl border p-3"
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
            placeholder="Stock"
          />
        </div>

        <div className="rounded-xl border p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Imagen</p>
              <p className="text-xs text-slate-500">png/jpg/webp (máx 3MB)</p>
            </div>

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
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {uploading ? "Subiendo..." : "Seleccionar imagen"}
            </button>
          </div>

          {(preview || form.image) && (
            <div className="mt-3 overflow-hidden rounded-xl border bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview || form.image} alt="imagen" className="h-48 w-full object-contain" />
            </div>
          )}
        </div>

        <textarea
          className="rounded-xl border p-3"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Descripción"
        />

        <textarea
          className="rounded-xl border p-3"
          value={form.details}
          onChange={(e) => setForm({ ...form, details: e.target.value })}
          placeholder="Detalles (uno por línea)"
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            className="rounded-xl border p-3"
            type="number"
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
            placeholder="Rating"
          />

          <button
            type="button"
            onClick={save}
            disabled={saving || uploading}
            className="rounded-xl bg-black px-4 py-3 font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar producto"}
          </button>
        </div>
      </div>

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
