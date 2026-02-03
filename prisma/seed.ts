import { PrismaClient } from "@prisma/client"
import { products, type Product } from "../src/data/products"

const prisma = new PrismaClient()

async function main() {
  for (const p of products as Product[]) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {
        name: p.name,
        price: p.price,
        category: p.category,
        image: p.image,
        description: p.description,
        details: p.details as any,
        rating: p.rating,
        stock: p.stock,
      },
      create: {
        id: p.id,
        name: p.name,
        price: p.price,
        category: p.category,
        image: p.image,
        description: p.description,
        details: p.details as any,
        rating: p.rating,
        stock: p.stock,
      },
    })
  }
  console.log(`✅ Seed listo: ${products.length} productos`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
