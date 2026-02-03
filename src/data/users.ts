export type Role = "ADMIN" | "VENDEDOR"

export const users = [
  { id: "u1", name: "Admin", username: "admin", password: "1234", role: "ADMIN" as const },
  { id: "u2", name: "Juan Vendedor", username: "juan", password: "1234", role: "VENDEDOR" as const },
]
