import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'laberna-dulce-cart'

function readStoredCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function makeLineKey(id, size) {
  return `${id}::${size ?? ''}`
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (product, quantity = 1) => {
    const lineKey = makeLineKey(product.id, product.size)
    setItems((current) => {
      const existing = current.find((item) => item.lineKey === lineKey)
      if (existing) {
        return current.map((item) =>
          item.lineKey === lineKey
            ? { ...item, quantity: item.quantity + quantity, notes: product.notes ?? item.notes }
            : item,
        )
      }
      return [
        ...current,
        {
          lineKey,
          id: product.id,
          name: product.name,
          price: product.price,
          size: product.size ?? null,
          notes: product.notes ?? '',
          quantity,
        },
      ]
    })
  }

  const removeItem = (lineKey) => {
    setItems((current) => current.filter((item) => item.lineKey !== lineKey))
  }

  const setQuantity = (lineKey, quantity) => {
    if (quantity < 1) {
      removeItem(lineKey)
      return
    }
    setItems((current) =>
      current.map((item) => (item.lineKey === lineKey ? { ...item, quantity } : item)),
    )
  }

  const clearCart = () => setItems([])

  const count = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const value = { items, addItem, removeItem, setQuantity, clearCart, count, subtotal }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  return useContext(CartContext)
}
