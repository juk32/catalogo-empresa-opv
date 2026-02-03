export function padFolio(n: number, size = 4) {
  return String(n).padStart(size, "0")
}

export function formatDateDDMMYY(d: Date) {
  const dd = String(d.getDate()).padStart(2, "0")
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const yy = String(d.getFullYear()).slice(-2)
  return `${dd}-${mm}-${yy}`
}

export function makePdfName(folioNumber: number, createdAt: Date, user: string) {
  const folio = padFolio(folioNumber)
  const date = formatDateDDMMYY(createdAt)
  const safeUser = (user || "Usuario").replace(/[^\w\-]+/g, "_")
  return `${folio}-${date}-${safeUser}.pdf`
}
