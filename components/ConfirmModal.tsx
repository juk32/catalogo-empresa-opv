"use client"

type ConfirmModalProps = {
  open: boolean
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({
  open,
  title = "Confirmar acción",
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Fondo */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl animate-in fade-in zoom-in">
        <h3 className="text-lg font-bold">{title}</h3>

        <p className="mt-2 text-sm text-slate-600">{message}</p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold text-white ${
              danger
                ? "bg-rose-600 hover:bg-rose-700"
                : "bg-slate-900 hover:bg-black"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
