"use client"

import { useMemo, useRef, useState, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"

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
        className={`relative w-full max-w-sm rounded-2xl bg-white/90 p-5 shadow-2xl ring-1 ${ring}
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

function money(n: number) {
  return n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="text-xs font-extrabold tracking-wide text-slate-700">{label}</span>
        {hint ? <span className="text-[11px] text-slate-500">{hint}</span> : null}
      </div>
      {children}
    </label>
  )
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

  const detailsArr = useMemo(
    () =>
      form.details
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    [form.details]
  )

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

  const disabled = saving || uploading

  return (
    <>
      <section className="relative">
        {/* Fondo PRO (azul + rojo sutil) */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-24 left-1/2 h-[420px] w-[920px] -translate-x-1/2 rounded-full bg-sky-300/18 blur-[120px]" />
          <div className="absolute top-12 left-10 h-[360px] w-[360px] rounded-full bg-indigo-300/10 blur-[120px]" />
          <div className="absolute top-16 right-10 h-[360px] w-[360px] rounded-full bg-rose-300/10 blur-[120px]" />
        </div>

        <div className="mx-auto max-w-6xl px-4">
          {/* Topbar */}
          <div className="pt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="rounded-full border border-white/60 bg-white/60 px-3 py-1 backdrop-blur">
                  Admin
                </span>
                <span className="text-slate-300">/</span>
                <span className="font-semibold text-slate-700">Productos</span>
                <span className="text-slate-300">/</span>
                <span className="font-semibold text-slate-900">Agregar</span>
              </div>

              <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Agregar producto
              </h1>
              <p className="mt-1 text-sm text-slate-600">Captura datos y guarda en el catálogo.</p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-2xl border border-white/60 bg-white/60 px-4 py-2 text-sm font-semibold text-slate-900 backdrop-blur hover:bg-white/80 transition"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={save}
                disabled={disabled}
                className={`rounded-2xl px-4 py-2 text-sm font-extrabold text-white transition
                  bg-gradient-to-r from-sky-600 via-indigo-600 to-rose-500
                  shadow-[0_18px_55px_-40px_rgba(2,6,23,0.7)]
                  hover:brightness-110 active:scale-[0.99]
                  ${disabled ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_380px]">
            {/* FORM CARD */}
            <div className="rounded-3xl border border-white/60 bg-white/70 backdrop-blur-2xl shadow-[0_30px_90px_-70px_rgba(2,6,23,0.8)] overflow-hidden">
              <div className="h-[2px] w-full bg-gradient-to-r from-sky-500/70 via-indigo-500/40 to-rose-500/45" />

              <div className="p-5 sm:p-7 space-y-6">
                {/* Identidad */}
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-extrabold text-slate-900">Información básica</p>
                    <p className="text-xs text-slate-500">Campos obligatorios: ID, nombre, categoría</p>
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <Field label="ID" hint="Ej: LECH-LACT-214">
                      <input
                        className="input-pro font-mono"
                        value={form.id}
                        onChange={(e) => setForm({ ...form, id: e.target.value })}
                        placeholder="LECH-LACT-214"
                        disabled={disabled}
                      />
                    </Field>

                    <Field label="Categoría">
                      <input
                        className="input-pro"
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        placeholder="Lácteos"
                        disabled={disabled}
                      />
                    </Field>

                    <div className="sm:col-span-2">
                      <Field label="Nombre">
                        <input
                          className="input-pro"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Nombre del producto"
                          disabled={disabled}
                        />
                      </Field>
                    </div>
                  </div>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200/70 to-transparent" />

                {/* Precio/Stock */}
                <div>
                  <p className="text-sm font-extrabold text-slate-900">Inventario</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <Field label="Precio" hint="MXN">
                      <input
                        className="input-pro"
                        type="number"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                        placeholder="0.00"
                        disabled={disabled}
                      />
                    </Field>

                    <Field label="Stock">
                      <input
                        className="input-pro"
                        type="number"
                        value={form.stock}
                        onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                        placeholder="0"
                        disabled={disabled}
                      />
                    </Field>

                    <Field label="Rating" hint="Ej: 4.5">
                      <input
                        className="input-pro"
                        type="number"
                        value={form.rating}
                        onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                        placeholder="4.5"
                        disabled={disabled}
                      />
                    </Field>

                    <div className="rounded-2xl border border-white/60 bg-white/60 p-4">
                      <div className="text-xs font-bold text-slate-700">Estado</div>
                      <div className="mt-1 text-sm font-extrabold text-slate-900">
                        {Number(form.stock) > 0 ? "En stock ✅" : "Agotado"}
                      </div>
                      <div className="mt-2 text-xs text-slate-600">
                        Precio actual: <span className="font-bold text-slate-900">${money(form.price || 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200/70 to-transparent" />

                {/* Imagen */}
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-extrabold text-slate-900">Imagen</p>
                      <p className="text-xs text-slate-600">png/jpg/webp (máx 3MB)</p>
                    </div>

                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={pickImage}
                      disabled={disabled}
                    />

                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      disabled={disabled}
                      className={`btn-outline ${disabled ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                      {uploading ? "Subiendo..." : "Seleccionar"}
                    </button>
                  </div>

                  {(preview || form.image) ? (
                    <div className="mt-3 overflow-hidden rounded-2xl border border-white/60 bg-white/80">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={preview || form.image}
                        alt="imagen"
                        className="h-56 w-full object-contain p-4"
                      />
                      <div className="px-4 pb-4 text-xs text-slate-600">
                        {uploading ? "Subiendo…" : form.image ? "Guardada en servidor ✅" : "Vista previa"}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 rounded-2xl border border-dashed border-slate-300/80 bg-white/50 p-5 text-sm text-slate-600">
                      Sin imagen seleccionada.
                      <div className="mt-1 text-xs text-slate-500">
                        Tip: usa imágenes cuadradas o con fondo transparente para verse mejor.
                      </div>
                    </div>
                  )}
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200/70 to-transparent" />

                {/* Texto */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Descripción">
                    <textarea
                      className="input-pro min-h-[120px] resize-none"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Descripción"
                      disabled={disabled}
                    />
                  </Field>

                  <Field label="Detalles (uno por línea)" hint="Se convierten a lista">
                    <textarea
                      className="input-pro min-h-[120px] resize-none font-mono text-[12px]"
                      value={form.details}
                      onChange={(e) => setForm({ ...form, details: e.target.value })}
                      placeholder={"Ingredientes...\nContenido neto...\nOrigen..."}
                      disabled={disabled}
                    />
                  </Field>
                </div>
              </div>
            </div>

            {/* PREVIEW SIDE */}
            <aside className="lg:sticky lg:top-[88px] h-fit">
              <div className="rounded-3xl border border-white/60 bg-white/65 backdrop-blur-2xl shadow-[0_30px_90px_-70px_rgba(2,6,23,0.7)] overflow-hidden">
                <div className="h-[2px] w-full bg-gradient-to-r from-sky-500/60 via-indigo-500/35 to-rose-500/45" />
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-extrabold text-slate-900">Vista previa</p>
                    <span className="text-[11px] text-slate-500">Catálogo</span>
                  </div>

                  <div className="mt-4 overflow-hidden rounded-3xl border border-white/70 bg-white shadow-[0_18px_55px_-45px_rgba(2,6,23,0.55)]">
                    <div className="relative h-44 bg-gradient-to-b from-slate-100 to-white">
                      {preview || form.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={preview || form.image}
                          alt="preview"
                          className="h-full w-full object-contain p-7 drop-shadow-[0_16px_30px_rgba(0,0,0,0.16)]"
                        />
                      ) : (
                        <div className="grid h-full place-items-center text-xs text-slate-500">Sin imagen</div>
                      )}

                      <div className="absolute left-4 top-4">
                        <span className="inline-flex items-center rounded-full bg-rose-500 px-3 py-1 text-xs font-black text-white shadow-sm">
                          Pro
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="text-xs font-semibold text-sky-700">{form.category || "Sin categoría"}</div>
                      <div className="mt-1 text-sm font-extrabold text-slate-900 line-clamp-2">
                        {form.name || "Nombre del producto"}
                      </div>

                      <div className="mt-1 text-xs text-slate-600">
                        ID: <span className="font-mono">{form.id || "—"}</span>
                      </div>

                      <div className="mt-3 flex items-end justify-between gap-3">
                        <div>
                          <div className="text-xs text-slate-500">Precio</div>
                          <div className="text-xl font-black text-slate-900">${money(form.price || 0)}</div>
                          <div className="mt-1 text-xs text-slate-600">
                            Stock: <span className="font-semibold text-slate-900">{form.stock}</span> • Rating:{" "}
                            <span className="font-semibold text-slate-900">{form.rating}</span>
                          </div>
                        </div>

                        <div className="rounded-full bg-slate-900 px-4 py-2 text-xs font-extrabold text-white shadow-[0_10px_25px_-14px_rgba(0,0,0,0.8)]">
                          Ver
                        </div>
                      </div>

                      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <p className="text-xs font-bold text-slate-700">Detalles</p>
                        {detailsArr.length ? (
                          <ul className="mt-2 space-y-1 text-xs text-slate-700">
                            {detailsArr.slice(0, 6).map((x, i) => (
                              <li key={i} className="flex gap-2">
                                <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-sky-500/80" />
                                <span className="line-clamp-2">{x}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mt-2 text-xs text-slate-500">Aún no hay detalles.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-xs text-slate-600">
                    Consejo: mantén el ID consistente y la categoría con la misma ortografía para filtrar mejor.
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* estilos locales pro */}
        <style>{`
          .input-pro{
            width: 100%;
            border-radius: 16px;
            border: 1px solid rgba(255,255,255,.60);
            background: rgba(255,255,255,.70);
            padding: 12px 14px;
            font-size: 14px;
            color: rgb(15 23 42);
            outline: none;
            transition: box-shadow .18s ease, border-color .18s ease, background .18s ease, transform .18s ease;
            box-shadow: 0 18px 55px -45px rgba(2,6,23,.35);
            backdrop-filter: blur(10px);
          }
          .input-pro::placeholder{ color: rgba(100,116,139,.9); }
          .input-pro:focus{
            border-color: rgba(56,189,248,.55);
            background: rgba(255,255,255,.85);
            box-shadow:
              0 0 0 1px rgba(56,189,248,.32),
              0 0 24px rgba(56,189,248,.18),
              0 0 14px rgba(244,63,94,.10),
              0 20px 70px -55px rgba(2,6,23,.55);
            transform: translateY(-1px);
          }

          .btn-outline{
            border-radius: 16px;
            border: 1px solid rgba(255,255,255,.65);
            background: rgba(255,255,255,.65);
            padding: 10px 14px;
            font-size: 13px;
            font-weight: 900;
            color: rgb(15 23 42);
            backdrop-filter: blur(10px);
            transition: transform .15s ease, box-shadow .15s ease, background .15s ease;
            box-shadow: 0 18px 55px -45px rgba(2,6,23,.35);
          }
          .btn-outline:hover{
            background: rgba(255,255,255,.88);
            box-shadow:
              0 0 20px rgba(56,189,248,.16),
              0 18px 55px -45px rgba(2,6,23,.45);
            transform: translateY(-1px);
          }

          @media (prefers-reduced-motion: reduce){
            .btn-outline, .input-pro{ transition: none !important; }
          }
        `}</style>
      </section>

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
