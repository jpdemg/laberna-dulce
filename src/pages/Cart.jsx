import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import usePageMeta from '../hooks/usePageMeta'
import { formatBRL } from '../lib/format'

export default function Cart() {
  usePageMeta({ title: 'Carrinho', noindex: true })

  const { items, setQuantity, removeItem, subtotal } = useCart()

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <h1 className="reveal">seu carrinho</h1>
        <p>Seu carrinho está vazio.</p>
        <Link className="btn btn--primary" to="/bolos">
          Ver produtos
        </Link>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <h1 className="reveal">seu carrinho</h1>

      <ul className="cart-list">
        {items.map((item) => (
          <li key={item.lineKey} className="cart-list__item">
            <span className="cart-list__name">
              {item.name}
              {item.size && <span className="cart-list__size"> · Tamanho {item.size}</span>}
              {item.notes && <span className="cart-list__notes"> · {item.notes}</span>}
            </span>
            <div className="cart-list__qty">
              <button type="button" onClick={() => setQuantity(item.lineKey, item.quantity - 1)}>
                −
              </button>
              <span>{item.quantity}</span>
              <button type="button" onClick={() => setQuantity(item.lineKey, item.quantity + 1)}>
                +
              </button>
            </div>
            <span className="cart-list__price">{formatBRL(item.price * item.quantity)}</span>
            <button type="button" className="cart-list__remove" onClick={() => removeItem(item.lineKey)}>
              Remover
            </button>
          </li>
        ))}
      </ul>

      <div className="cart-summary">
        <span>Subtotal</span>
        <strong>{formatBRL(subtotal)}</strong>
      </div>

      <Link className="btn btn--primary" to="/checkout">
        Finalizar compra
      </Link>
    </div>
  )
}
