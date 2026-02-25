import QrShareClient from "./QrShareClient"

export const runtime = "nodejs"
type Ctx = { params: Promise<{ id: string }> }

export default async function Page({ params }: Ctx) {
  const { id: raw } = await params
  const id = decodeURIComponent(raw)
  return <QrShareClient id={id} />
}