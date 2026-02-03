import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { users } from "@/src/data/users"

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
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

        return { id: u.id, name: u.name, role: u.role }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role
      return token
    },
    async session({ session, token }) {
      ;(session.user as any).role = (token as any).role
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
})
