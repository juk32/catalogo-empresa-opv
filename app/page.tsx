import { products } from "@/data/products"

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Catálogo de Productos prueba
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-xl p-4 shadow hover:shadow-md transition"
          >
            <div className="h-40 bg-gray-100 flex items-center justify-center mb-4">
              Imagen
            </div>

            <h2 className="font-semibold">{product.name}</h2>
            <p className="text-sm text-gray-500">{product.category}</p>
            <p className="mt-2 font-bold">
              ${product.price.toLocaleString("es-MX")}
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}
