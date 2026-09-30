import { useState } from 'react'
import { Link } from 'react-router-dom'
import ProductMedia from './ProductMedia'
import FavoriteButton from './FavoriteButton'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useFavoriteIds } from '../hooks/useFavorites'
import { formatBRL } from '../lib/format'

export default function ProductGrid({ products }) {
  const { addItem } = useCart()
  const { user } = useAuth()
  const { isFavorite, toggleFavorite } = useFavoriteIds()
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
            {user && (
              <FavoriteButton
                className="product-card__favorite"
                isFavorite={isFavorite(product.id)}
                onToggle={() => toggleFavorite(product.id)}
              />
            )}
            <h3>{product.name}</h3>
          </Link>
          <p className="product-card__price">{formatBRL(product.price)}</p>
          <button
            type="button"
            className={`btn btn--add icon-add-btn ${addedId === product.id ? 'is-added' : ''}`}
            onClick={() => handleAdd(product)}
          >
            <span className="icon-add-btn__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="icon-add-btn__icon-cart">
                <path d="M5 8h14l-1.3 11H6.3Z" />
                <path d="M8.5 8V6a3.5 3.5 0 0 1 7 0v2" />
              </svg>
              <svg viewBox="0 0 24 24" className="icon-add-btn__icon-check">
                <path d="M5 13l5 5L20 7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            {addedId === product.id ? 'Adicionado' : 'Adicionar ao carrinho'}
          </button>
        </li>
      ))}
    </ul>
  )
}
