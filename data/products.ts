export type Product = {
  id: string
  name: string
  price: number
  category: string
  image: string
  description: string
  details: string[]
  rating: number
}

export const products: Product[] = [
  {
    id: "nutella",
    name: "Nutella",
    price: 145,
    category: "Accesorios",
    image: "/demo/nutella.png",
    description:
      "Una crema de avellanas con cacao, ideal para desayunos y postres.",
    details: [
      "Ingredientes: Azúcar, aceite de palma, avellanas (13%)",
      "Contenido neto: 350 g",
      "Origen: Italia",
    ],
    rating: 4.6,
  },
  {
    id: "aceite",
    name: "Aceite",
    price: 135,
    category: "Productos",
    image: "/demo/aceite.jpg",
    description:
      "Aceite multiusos para cocina. Perfecto para freír y preparar alimentos.",
    details: ["Presentación: 1 L", "Uso: Cocina", "Marca: Genérica"],
    rating: 4.2,
  },
  {
    id: "chocolate",
    name: "Chocolate",
    price: 175,
    category: "Productos",
    image: "/demo/chocolate.png",
    description:
      "Chocolate en barra, ideal para snacks o repostería.",
    details: ["Presentación: 2 barras", "Tipo: Chocolate con leche"],
    rating: 4.4,
  },
]
