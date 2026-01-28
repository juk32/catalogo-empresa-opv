export type Product = {
  id: string
  name: string
  price: number
  category: string
  image: string
  description: string
  details: string[]
  rating: number
  stock: number
}

export const products: Product[] = [
  /* LACTEOS */
  {
    id: "LECH-LACT-115",
    name: "Leche deslactosada de 1.5 LT",
    price: 46.50,
    category: "Lacteos",
    image: "/demo/LECHE_1.5_LT.png",
    description:
      "Una crema de avellanas con cacao, ideal para desayunos y postres.",
    details: [
      "Ingredientes: Azúcar, aceite de palma, avellanas (13%)",
      "Contenido neto: 350 g",
      "Origen: Italia",
    ],
    rating: 4.6,
    stock: 9,
  },
  {
    id: "LECH-LACT-116",
    name: "Leche clasica de 1.5 LT",
    price: 49.00,
    category: "Lacteos",
    image: "/demo/LECHE_CLASICA_1.5_LT.webp",
    description:
      "Una crema de avellanas con cacao, ideal para desayunos y postres.",
    details: [
      "Ingredientes: Azúcar, aceite de palma, avellanas (13%)",
      "Contenido neto: 350 g",
      "Origen: Italia",
    ],
    rating: 4.6,
    stock: 3,
  },
  {
    id: "nutella-3",
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
    stock: 3,
  },

  /* PRODUCTOS */
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
    stock: 3,
  },
  {
    id: "chocolate",
    name: "Chocolate",
    price: 175,
    category: "Productos",
    image: "/demo/chocolate.png",
    description: "Chocolate en barra, ideal para snacks o repostería.",
    details: ["Presentación: 2 barras", "Tipo: Chocolate con leche"],
    rating: 4.4,
    stock: 3,
  },
  {
    id: "nutella-producto-1",
    name: "Nutella",
    price: 145,
    category: "Productos",
    image: "/demo/nutella.png",
    description:
      "Una crema de avellanas con cacao, ideal para desayunos y postres.",
    details: [
      "Ingredientes: Azúcar, aceite de palma, avellanas (13%)",
      "Contenido neto: 350 g",
      "Origen: Italia",
    ],
    rating: 4.6,
    stock: 3,
  },
  {
    id: "nutella-producto-2",
    name: "Nutella",
    price: 145,
    category: "Productos",
    image: "/demo/nutella.png",
    description:
      "Una crema de avellanas con cacao, ideal para desayunos y postres.",
    details: [
      "Ingredientes: Azúcar, aceite de palma, avellanas (13%)",
      "Contenido neto: 350 g",
      "Origen: Italia",
    ],
    rating: 4.6,
    stock: 3,
  },

  /* LIMPIEZA */
  {
    id: "ACEI-ACEI-1173-01",
    name: "Jabón",
    price: 35.2,
    category: "Limpieza",
    image: "/home/jabon.png",
    description: "Jabón de uso diario.",
    details: ["Presentación: 1 pza"],
    rating: 4.3,
    stock: 3,
  },
  {
    id: "ACEI-ACEI-1173-02",
    name: "Jabón",
    price: 35.2,
    category: "Limpieza",
    image: "/home/jabon.png",
    description: "Jabón de uso diario.",
    details: ["Presentación: 1 pza"],
    rating: 4.3,
    stock: 3,
  },
  {
    id: "ACEI-ACEI-1173-03",
    name: "Jabón",
    price: 35.2,
    category: "Limpieza",
    image: "/home/jabon.png",
    description: "Jabón de uso diario.",
    details: ["Presentación: 1 pza"],
    rating: 4.3,
    stock: 3,
  },
  {
    id: "ACEI-ACEI-1173-04",
    name: "Jabón",
    price: 35.2,
    category: "Limpieza",
    image: "/home/jabon.png",
    description: "Jabón de uso diario.",
    details: ["Presentación: 1 pza"],
    rating: 4.3,
    stock: 3,
  },
  {
    id: "ACEI-ACEI-1173-05",
    name: "Jabón",
    price: 35.2,
    category: "Limpieza",
    image: "/home/jabon.png",
    description: "Jabón de uso diario.",
    details: ["Presentación: 1 pza"],
    rating: 4.3,
    stock: 3,
  },
  {
    id: "ACEI-ACEI-1173-06",
    name: "Jabón",
    price: 35.2,
    category: "Limpieza",
    image: "/home/jabon.png",
    description: "Jabón de uso diario.",
    details: ["Presentación: 1 pza"],
    rating: 4.3,
    stock: 3,
  },
]
