"use client"

import { useEffect, useMemo, useState } from "react"
import { signIn, useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { ShoppingCart, User, Lock } from "lucide-react"

function cx(...s: Array<string | false | null | undefined>) {
  return s.filter(Boolean).join(" ")
}

function safeCallbackUrl(raw: string | null) {
  if (!raw) return "/productos"
  if (raw.startsWith("/")) return raw
  return "/productos"
}

export default function LoginClient() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const params = useSearchParams()
  const callbackUrl = useMemo(() => safeCallbackUrl(params.get("callbackUrl")), [params])

  const { status } = useSession()

  useEffect(() => {
    if (status === "authenticated") {
      window.location.assign(callbackUrl) // ✅ respeta retorno
    }
  }, [status, callbackUrl])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
      callbackUrl,
    })

    setLoading(false)

    if (!res?.ok || res?.error) {
      setError("Usuario o contraseña incorrectos")
      return
    }

    window.location.assign(res.url || callbackUrl)
  }

  return (
    <div className="relative w-full min-h-[calc(100vh-180px)] flex items-center justify-center">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#1f4bd6]" />
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-white/10 blur-[70px]" />
        <div className="absolute -bottom-48 -right-48 h-[560px] w-[560px] rounded-full bg-black/10 blur-[80px]" />

        <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,120 C240,220 420,40 720,140 C1020,240 1140,160 1440,220 L1440,0 L0,0 Z" fill="white" opacity="0.10" />
          <path d="M0,420 C260,520 450,300 720,420 C990,540 1160,430 1440,520 L1440,0 L0,0 Z" fill="white" opacity="0.07" />
          <path d="M0,760 C260,700 430,880 720,780 C1010,680 1180,820 1440,740 L1440,0 L0,0 Z" fill="white" opacity="0.06" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-[420px] px-4">
        <div className="rounded-[26px] border border-white/25 bg-white/10 backdrop-blur-xl shadow-[0_40px_120px_-70px_rgba(0,0,0,.85)] overflow-hidden">
          <div className="h-[2px] w-full bg-gradient-to-r from-white/40 via-white/10 to-white/40 opacity-80" />

          <div className="p-7 sm:p-8">
            <div className="flex flex-col items-center text-center">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/20 shadow-[0_25px_60px_-40px_rgba(255,255,255,.6)]">
                <ShoppingCart className="h-8 w-8 text-white" />
              </div>

              <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-white">Iniciar sesión</h1>
              <p className="mt-2 text-sm text-white/80">Accede al catálogo y genera pedidos rápido.</p>
            </div>

            <form onSubmit={onSubmit} className="mt-6 grid gap-3">
              <label className="grid gap-1">
                <span className="text-xs font-semibold text-white/80">Usuario</span>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/75">
                    <User size={16} />
                  </span>
                  <input
                    className={cx(
                      "h-11 w-full rounded-xl border px-10 text-sm outline-none",
                      "border-white/25 bg-white/10 text-white placeholder:text-white/55",
                      "focus:ring-2 focus:ring-white/30"
                    )}
                    placeholder="USERNAME"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    disabled={loading || status === "loading"}
                  />
                </div>
              </label>

              <label className="grid gap-1">
                <span className="text-xs font-semibold text-white/80">Contraseña</span>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/75">
                    <Lock size={16} />
                  </span>
                  <input
                    className={cx(
                      "h-11 w-full rounded-xl border px-10 text-sm outline-none",
                      "border-white/25 bg-white/10 text-white placeholder:text-white/55",
                      "focus:ring-2 focus:ring-white/30"
                    )}
                    placeholder="PASSWORD"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    disabled={loading || status === "loading"}
                  />
                </div>
              </label>

              {error && (
                <div className="rounded-xl border border-white/25 bg-white/10 px-3 py-2 text-sm font-semibold text-white">
                  {error}
                </div>
              )}

              <button
                disabled={loading || status === "loading"}
                className={cx(
                  "mt-2 h-11 w-full rounded-xl font-bold tracking-wide",
                  "bg-white text-[#1f4bd6] shadow-[0_22px_55px_-35px_rgba(0,0,0,.75)]",
                  "hover:bg-white/95 active:scale-[0.99] transition",
                  "disabled:opacity-70 disabled:cursor-not-allowed"
                )}
              >
                {loading ? "ENTRANDO..." : "LOGIN"}
              </button>

              <div className="mt-1 flex items-center justify-center">
                <a href="#" className="text-sm text-white/85 hover:text-white underline underline-offset-4">
                  Forgot password?
                </a>
              </div>
            </form>
          </div>

          <div className="h-[2px] w-full bg-gradient-to-r from-white/40 via-white/10 to-white/40 opacity-70" />
        </div>
      </div>
    </div>
  )
}