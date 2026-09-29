import { useState } from 'react'
import { Link } from 'react-router-dom'
import ProductMedia from './ProductMedia'
import { useCart } from '../context/CartContext'
import { formatBRL } from '../lib/format'

export default function ProductGrid({ products }) {
  const { addItem } = useCart()
  const [addedId, setAddedId] = useState(null)

  const handleAdd = (product) => {
    const defaultSize = product.sizes?.[1]?.label ?? product.sizes?.[0]?.label ?? null
    const multiplier = product.sizes?.find((size) => size.label === defaultSize)?.multiplier ?? 1
    addItem({ ...product, price: product.price * multiplier, size: defaultSize }, 1)
    setAddedId(product.id)
    setTimeout(() => setAddedId((current) => (current === product.id ? null : current)), 1500)
  }

  return (
    <ul className="product-grid">
      {products.map((product, index) => (
        <li key={product.id} className="product-card reveal" style={{ '--reveal-delay': `${(index % 4) * 0.12}s` }}>
          <Link to={`/produto/${product.id}`} className="product-card__link">
            <ProductMedia product={product} variant={index} seal tag={product.tag} reveal={false} />
            <h3>{product.name}</h3>
          </Link>
          <p className="product-card__price">{formatBRL(product.price)}</p>
          <button type="button" className="btn btn--add" onClick={() => handleAdd(product)}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 8h14l-1.3 11H6.3Z" />
              <path d="M8.5 8V6a3.5 3.5 0 0 1 7 0v2" />
            </svg>
            {addedId === product.id ? 'Adicionado ✓' : 'Adicionar ao carrinho'}
          </button>
        </li>
      ))}
    </ul>
  )
}
