import { prisma } from "@/lib/prisma"
import ProductCard3D from "./ProductCard3D"

type ProductRow = {
  id: string
  name: string
  price: number
  category: string
  image: string
  description: string
  details: any
  rating: number
  stock: number
}

export default async function ProductosPage() {
  const products = (await prisma.product.findMany()) as ProductRow[]

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Productos</h1>
          <p className="mt-1 text-slate-600">Catálogo general</p>
        </div>

        <div className="text-xs text-slate-500">
          {products.length} producto{products.length === 1 ? "" : "s"}
        </div>
      </div>

      <div className="rounded-[28px] border bg-white/70 p-3 shadow-sm backdrop-blur sm:p-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p: ProductRow) => (
            <ProductCard3D
              key={p.id}
              id={p.id}
              name={p.name}
              category={p.category}
              image={p.image}
              description={p.description}
              price={p.price}
              stock={p.stock}
              href={`/producto/${p.id}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

