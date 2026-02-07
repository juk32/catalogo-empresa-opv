import { prisma } from "@/lib/prisma"
import ProductCard3D from "./ProductCard3D"
import { unstable_noStore as noStore } from "next/cache"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ProductosPage() {
  noStore()

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  })

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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {products.map((p) => (
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
