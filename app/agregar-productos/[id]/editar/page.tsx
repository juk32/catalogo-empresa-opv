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

export default function EditarProductoPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement | null>(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState("")

  const [p, setP] = useState<Product | null>(null)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch(`/api/products/${params.id}`, { cache: "no-store" })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        alert(data?.error || "No se pudo cargar")
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

  async function uploadImage(file: File) {
    const fd = new FormData()
    fd.append("file", file)

    const res = await fetch("/api/upload", { method: "POST", body: fd })
    const data = await res.json().catch(() => ({} as any))
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
    } catch (err: any) {
      alert(err?.message || "Error subiendo imagen")
      e.target.value = ""
      setPreview("")
    } finally {
      setUploading(false)
    }
  }

  async function save() {
    if (!p) return
    setSaving(true)
    try {
      const res = await fetch(`/api/products/${p.id}`, {
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
        alert(data?.error || "No se pudo guardar")
        return
      }

      alert("Guardado ✅")
      router.push("/admin/productos")
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-6">Cargando...</div>
  if (!p) return <div className="p-6">No encontrado</div>

  return (
    <div className="mx-auto max-w-2xl p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Editar producto</h1>
        <p className="text-sm text-slate-600">{p.id}</p>
      </div>

      <input className="rounded-xl border p-3" value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} />
      <input className="rounded-xl border p-3" value={p.category} onChange={(e) => setP({ ...p, category: e.target.value })} />
      <input className="rounded-xl border p-3" type="number" value={p.price} onChange={(e) => setP({ ...p, price: Number(e.target.value) })} />
      <input className="rounded-xl border p-3" type="number" value={p.stock} onChange={(e) => setP({ ...p, stock: Number(e.target.value) })} />

      {/* Imagen con botón */}
      <div className="rounded-xl border p-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Imagen</p>
          <span className="text-xs text-slate-600">{p.image}</span>
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
          className="mt-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {uploading ? "Subiendo..." : "Cambiar imagen"}
        </button>

        {(preview || p.image) && (
          <div className="mt-3 overflow-hidden rounded-xl border bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview || p.image} alt="img" className="h-48 w-full object-contain" />
          </div>
        )}
      </div>

      <textarea className="rounded-xl border p-3" value={p.description} onChange={(e) => setP({ ...p, description: e.target.value })} />

      <textarea
        className="rounded-xl border p-3"
        value={Array.isArray(p.details) ? p.details.join("\n") : String(p.details || "")}
        onChange={(e) => setP({ ...p, details: e.target.value })}
        placeholder="Detalles (1 por línea)"
      />

      <div className="grid grid-cols-2 gap-3">
        <input className="rounded-xl border p-3" type="number" value={p.rating} onChange={(e) => setP({ ...p, rating: Number(e.target.value) })} />
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
  )
}
