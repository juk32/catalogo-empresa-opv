"use client"

import { usePathname } from "next/navigation"

export default function FooterGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Oculta footer/whatsapp en login
  if (pathname === "/login") return null

  return <>{children}</>
}