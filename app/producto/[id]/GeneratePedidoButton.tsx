"use client"

import { useRouter } from "next/navigation"
import { addToCart } from "@/lib/cart"

type Props = {
  id: string
  name: string
  price: number
  disabled?: boolean
  className?: string
}

export default function GeneratePedidoButton({ id, name, price, disabled, className }: Props) {
  const router = useRouter()

  return (
    <button
      type="button"
      disabled={disabled}
      className={className}
      onClick={() => {
        if (disabled) return
        addToCart({ id, name, price }, 1)
        router.push("/carrito")
      }}
    >
      Generar pedido
    </button>
  )
}
