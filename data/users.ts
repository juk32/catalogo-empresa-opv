export type Role = "ADMIN" | "VENDEDOR"

export type AppUser = {
  id: string
  name: string
  username: string
  password: string // temporal (luego bcrypt)
  role: Role
}

export const users: AppUser[] = [
  { id: "u1", name: "Admin", username: "admin", password: "admin123", role: "ADMIN" },
  { id: "u2", name: "Vendedor 1", username: "vendedor", password: "vendedor123", role: "VENDEDOR" },
  
]
