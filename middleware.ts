import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/auth"

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  // Rutas públicas
  if (
    path.startsWith("/login") ||
    path.startsWith("/api/auth") ||
    path.startsWith("/_next") ||
    path.startsWith("/favicon.ico") ||
    path.startsWith("/icons") ||
    path.startsWith("/images") ||
    path === "/" ||
    path.startsWith("/productos") ||
    path.startsWith("/contacto")
  ) {
    return NextResponse.next()
  }

  // Rutas protegidas (aquí pon las que quieres obligar login)
  const protectedRoutes = ["/carrito", "/generar-pedido", "/pedidos"]

  const isProtected = protectedRoutes.some((p) => path.startsWith(p))
  if (!isProtected) return NextResponse.next()

  // ✅ Obtener sesión (server-side)
  const session = await auth()

  if (!session?.user) {
    const loginUrl = new URL("/login", req.nextUrl.origin)
    loginUrl.searchParams.set("callbackUrl", path)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
