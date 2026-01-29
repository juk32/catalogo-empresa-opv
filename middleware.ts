import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Permitir siempre estas rutas
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next()
  }

  // Protegidas (por ahora solo bloquea si NO hay cookie de sesión)
  const protectedRoutes = ["/productos", "/producto", "/generar-pedido", "/admin"]
  const isProtected = protectedRoutes.some((p) => pathname.startsWith(p))

  if (isProtected) {
    // NextAuth/Auth.js normalmente guarda algo en cookies (esto es “heurístico”)
    // Si no hay cookies, lo mandamos a login.
    const hasCookies = req.headers.get("cookie")?.length
    if (!hasCookies) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
