export function pad4(n: number) {
  return String(n).padStart(4, "0")
}

export function formatDMY(d: Date) {
  const dd = String(d.getDate()).padStart(2, "0")
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const yy = String(d.getFullYear()).slice(-2)
  return `${dd}-${mm}-${yy}`
}

export function buildFolio(folioNumber: number, createdAt: Date, user: string) {
  const u = (user || "USUARIO").toUpperCase().replace(/\s+/g, "_")
  return `${pad4(folioNumber)}-${formatDMY(createdAt)}-${u}`
}

export function buildPdfFileName(folio: string) {
  return `pedido-${folio}.pdf`
}
