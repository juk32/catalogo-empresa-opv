"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"

type FormState = {
  id: string
  name: string
  price: string
  category: string
  image: string
  description: string
  details: string
  rating: string
  stock: string
}

export default function AgregarProductosPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement | null>(null)

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string>("")

  const [form, setForm] = useState<FormState>({
    id: "",
    name: "",
    price: "",
    category: "",
    image: "",
    description: "",
    details: "",
    rating: "5",
    stock: "0",
  })

  function set<K extends keyof FormState>(key: K, value: string) {
    setForm((p) => ({ ...p, [key]: value }))
  }

  async function uploadImage(file: File) {
    const fd = new FormData()
    fd.append("file", file)

    const res = await fetch("/api/upload", {
      method: "POST",
      body: fd,
    })

    // 👇 aquí mostramos el error real del server
    const data = await res.json().catch(() => ({} as any))
    if (!res.ok) {
      throw new Error(data?.error || `Error subiendo imagen (${res.status})`)
    }

    return data.url as string
  }

  async function onPickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // preview inmediato
    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)

    setUploading(true)
    try {
      const url = await uploadImage(file)
      set("image", url)
    } catch (err: any) {
      alert(err?.message || "No se pudo subir imagen")
      setPreview("")
      set("image", "")
      e.target.value = ""
    } finally {
      setUploading(false)
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!form.image) {
      alert("Primero sube una imagen ✅")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.id.trim(),
          name: form.name.trim(),
          price: Number(form.price),
          category: form.category.trim(),
          image: form.image.trim(),
          description: form.description.trim(),
          details: form.details
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
          rating: Number(form.rating),
          stock: Number(form.stock),
        }),
      })

      const data = await res.json().catch(() => ({} as any))
      if (!res.ok) {
        alert(data?.error || "No se pudo agregar el producto")
        return
      }

      alert("Producto agregado ✅")
      router.push("/productos")
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold">Agregar productos</h1>
      <p className="mt-1 text-sm text-slate-600">
        Lo que agregues aquí se mostrará en el catálogo.
      </p>

      <form onSubmit={onSubmit} className="mt-6 grid gap-4">
        <input className="rounded-xl border p-3" placeholder="ID (ej. LECH-LACT-115)" value={form.id} onChange={(e) => set("id", e.target.value)} required />
        <input className="rounded-xl border p-3" placeholder="Nombre" value={form.name} onChange={(e) => set("name", e.target.value)} required />
        <input className="rounded-xl border p-3" placeholder="Precio (ej. 46.50)" value={form.price} onChange={(e) => set("price", e.target.value)} required />
        <input className="rounded-xl border p-3" placeholder="Categoría (Lacteos, Abarrotes...)" value={form.category} onChange={(e) => set("category", e.target.value)} required />

        {/* ✅ BOTÓN para seleccionar imagen */}
        <div className="rounded-xl border p-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Imagen</p>
            {form.image ? (
              <span className="text-xs text-emerald-700">✅ lista</span>
            ) : (
              <span className="text-xs text-slate-500">obligatoria</span>
            )}
          </div>

          <div className="mt-2 flex items-center gap-3">
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={onPickImage}
              disabled={uploading || loading}
            />

            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading || loading}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {uploading ? "Subiendo..." : "Seleccionar imagen"}
            </button>

            <div className="text-xs text-slate-600">
              {form.image ? (
                <span>Guardada como: {form.image}</span>
              ) : (
                <span>png/jpg/webp (máx 3MB)</span>
              )}
            </div>
          </div>

          {preview && (
            <div className="mt-3 overflow-hidden rounded-xl border bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="preview" className="h-48 w-full object-contain" />
            </div>
          )}
        </div>

        <textarea className="rounded-xl border p-3" placeholder="Descripción" value={form.description} onChange={(e) => set("description", e.target.value)} required />
        <textarea className="rounded-xl border p-3" placeholder="Detalles (1 por línea)" value={form.details} onChange={(e) => set("details", e.target.value)} />

        <div className="grid grid-cols-2 gap-3">
          <input className="rounded-xl border p-3" placeholder="Rating (ej. 4.6)" value={form.rating} onChange={(e) => set("rating", e.target.value)} />
          <input className="rounded-xl border p-3" placeholder="Stock" value={form.stock} onChange={(e) => set("stock", e.target.value)} />
        </div>

        <button
          disabled={loading || uploading}
          className="rounded-xl bg-black px-4 py-3 font-semibold text-white disabled:opacity-50"
        >
          {uploading ? "Subiendo imagen…" : loading ? "Guardando..." : "Guardar producto"}
        </button>
      </form>
    </div>
  )
}

