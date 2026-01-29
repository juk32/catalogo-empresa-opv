import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { users } from "@/data/users"

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Usuario", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const username = String(credentials?.username || "")
        const password = String(credentials?.password || "")

        const u = users.find((x) => x.username === username && x.password === password)
        if (!u) return null

        return { id: u.id, name: u.name, role: u.role } as any
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) token.role = user.role
      return token
    },
    async session({ session, token }: any) {
      ;(session.user as any).role = token.role
      return session
    },
  },
  pages: { signIn: "/login" },
}
