"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const params = useSearchParams()
  const callbackUrl = params.get("callbackUrl") || "/productos"

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
      callbackUrl,
    })

    if (!res?.ok) {
      setError("Usuario o contraseña incorrectos")
      return
    }

    router.push(res.url || callbackUrl)
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold">Iniciar sesión</h1>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <input
          className="w-full rounded-xl border p-3"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="w-full rounded-xl border p-3"
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

        <button className="w-full rounded-xl bg-black px-4 py-3 font-semibold text-white">
          Entrar
        </button>
      </form>
    </div>
  )
}
