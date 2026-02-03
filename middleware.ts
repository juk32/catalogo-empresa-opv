import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const path = req.nextUrl.pathname

  // Next internals / assets
  if (
    path.startsWith("/_next") ||
    path === "/favicon.ico" ||
    path.startsWith("/demo/")
  ) return NextResponse.next()

  // Auth endpoints
  if (path.startsWith("/api/auth")) return NextResponse.next()

  // Rutas públicas (se ven sin login)
  const PUBLIC = [
    "/",
    "/login",
    "/productos",
    "/contacto",
    "/accesorios",
    "/carrito",
    "/generar-pedido",
  ]
  const isPublic = PUBLIC.includes(path) || path.startsWith("/producto/")
  if (isPublic) return NextResponse.next()

  // Rutas privadas
  const PRIVATE =
    path.startsWith("/pedidos") ||
    path.startsWith("/admin") ||
    path.startsWith("/api/orders")

  if (PRIVATE && !req.auth) {
    const url = new URL("/login", req.nextUrl.origin)
    url.searchParams.set("callbackUrl", path)
    return NextResponse.redirect(url)
  }

  // Admin-only
  if (path.startsWith("/admin")) {
    const role = (req.auth?.user as any)?.role as string | undefined
    if (role !== "ADMIN") return NextResponse.redirect(new URL("/", req.nextUrl.origin))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
