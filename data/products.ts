export type Product = {
  id: number
  name: string
  price: number
  category: string
}

export const products: Product[] = [
  {
    id: 1,
    name: "Tablet 4G con GPS",
    price: 3799,
    category: "Tablets",
  },
  {
    id: 2,
    name: "Router Wi-Fi Dual Band",
    price: 899,
    category: "Redes",
  },
  {
    id: 3,
    name: "SSD M.2 512GB",
    price: 790,
    category: "Almacenamiento",
  },
]
