import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const path = req.nextUrl.pathname

  // Rutas públicas
  if (
    path.startsWith("/login") ||
    path.startsWith("/api/auth") ||
    path.startsWith("/_next") ||
    path === "/favicon.ico"
  ) {
    return NextResponse.next()
  }

  // Si no hay sesión -> al login
  if (!req.auth) {
    const url = new URL("/login", req.nextUrl.origin)
    url.searchParams.set("callbackUrl", req.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Ejemplo de rol admin (si luego haces /admin)
  const role = (req.auth.user as any)?.role as string | undefined
  if (path.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
