"use client"

import { usePathname } from "next/navigation"
import SiteHeader from "@/components/SiteHeader"

export default function HeaderGate() {
  const pathname = usePathname()

  // Oculta header en login (sin reestructurar carpetas)
  if (pathname === "/login") return null

  return <SiteHeader />
}