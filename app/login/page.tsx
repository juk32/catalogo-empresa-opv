"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    const res = await signIn("credentials", {
      username,
      password,
      redirect: true,
      callbackUrl: "/productos",
    })
    // si no redirige, res?.error vendrá con mensaje (depende config)
    if ((res as any)?.error) setError("Credenciales inválidas")
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <div className="rounded-3xl border bg-white/70 p-6 shadow-lg backdrop-blur">
        <h1 className="text-2xl font-bold">Iniciar sesión</h1>
        <p className="mt-1 text-slate-600">Acceso para vendedores y administradores</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-semibold">Usuario</label>
            <input
              className="mt-1 w-full rounded-2xl border bg-white px-4 py-3"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="vendedor / admin"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Contraseña</label>
            <input
              className="mt-1 w-full rounded-2xl border bg-white px-4 py-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="vendedor123 / admin123"
            />
          </div>

          {error && <p className="text-sm font-semibold text-rose-700">{error}</p>}

          <button className="w-full rounded-2xl bg-gradient-to-r from-sky-600 to-rose-600 py-3 font-semibold text-white shadow hover:brightness-95">
            Entrar
          </button>
        </form>
      </div>
    </main>
  )
}
