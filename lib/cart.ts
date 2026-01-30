export type CartItem = {
  id: string
  name: string
  price: number
  qty: number
}

const KEY = "cart_v1"

function read(): CartItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch {
    return []
  }
}

function write(items: CartItem[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(KEY, JSON.stringify(items))
}

export function getCart(): CartItem[] {
  return read()
}



export function addToCart(
  item: Omit<CartItem, "qty">,
  qty: number = 1
): CartItem[] {
  const cart = read()
  const i = cart.findIndex((x) => x.id === item.id)

  if (i >= 0) {
    cart[i] = { ...cart[i], qty: cart[i].qty + qty }
  } else {
    cart.push({ ...item, qty })
  }

  write(cart)
  return cart
}

export function removeFromCart(id: string): CartItem[] {
  const cart = read().filter((x) => x.id !== id)
  write(cart)
  return cart
}

export function setQty(id: string, qty: number): CartItem[] {
  const cart = read()
  const i = cart.findIndex((x) => x.id === id)
  if (i < 0) return cart

  if (qty <= 0) cart.splice(i, 1)
  else cart[i] = { ...cart[i], qty }

  write(cart)
  return cart
}

export function clearCart() {
  write([])
}
