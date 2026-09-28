import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb'
import Placeholder from '../components/Placeholder'
import { useCart } from '../context/CartContext'
import { findProductById } from '../data/site'
import { formatBRL } from '../lib/format'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const product = findProductById(id)

  const [activePhoto, setActivePhoto] = useState(0)
  const [sizeLabel, setSizeLabel] = useState(product?.sizes?.[1]?.label ?? product?.sizes?.[0]?.label)
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')
  const [added, setAdded] = useState(false)

  if (!product) {
    return <Navigate to="/" replace />
  }

  const selectedSize = product.sizes.find((size) => size.label === sizeLabel) ?? product.sizes[0]
  const unitPrice = product.price * selectedSize.multiplier

  const buildCartItem = () => ({
    ...product,
    price: unitPrice,
    size: selectedSize.label,
    notes: notes.trim(),
  })

  const handleAddToCart = () => {
    addItem(buildCartItem(), quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = () => {
    addItem(buildCartItem(), quantity)
    navigate('/checkout')
  }

  return (
    <div className="product-detail">
      <Breadcrumb label={product.name} />

      <div className="product-detail__layout">
        <div className="product-detail__gallery">
          <Placeholder
            label={product.name}
            variant={activePhoto}
            seal
            className="product-detail__main-photo"
            reveal={false}
          />
          <div className="product-detail__thumbs">
            {product.gallery.map((variant, index) => (
              <button
                key={variant}
                type="button"
                className={`product-detail__thumb ${index === activePhoto ? 'is-active' : ''}`}
                onClick={() => setActivePhoto(index)}
                aria-label={`Ver foto ${index + 1}`}
              >
                <Placeholder label={`${product.name} foto ${index + 1}`} variant={variant} reveal={false} />
              </button>
            ))}
          </div>
        </div>

        <div className="product-detail__info">
          {product.categoryLabel && <p className="eyebrow">{product.categoryLabel}</p>}
          <h1>{product.name}</h1>
          <p className="product-detail__price">{formatBRL(unitPrice)}</p>

          <div className="product-detail__field">
            <span>Tamanho</span>
            <div className="size-selector">
              {product.sizes.map((size) => (
                <button
                  key={size.label}
                  type="button"
                  className={`size-selector__option ${size.label === sizeLabel ? 'is-active' : ''}`}
                  onClick={() => setSizeLabel(size.label)}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          <div className="product-detail__field">
            <span>Quantidade</span>
            <div className="qty-selector">
              <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                −
              </button>
              <span>{quantity}</span>
              <button type="button" onClick={() => setQuantity((q) => q + 1)}>
                +
              </button>
            </div>
          </div>

          <label className="product-detail__field">
            <span>Observações (opcional)</span>
            <textarea
              placeholder="Ex.: escrever 'Parabéns, Maria!' na cobertura"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </label>

          <div className="product-detail__actions">
            <button type="button" className="btn btn--outline" onClick={handleAddToCart}>
              {added ? 'Adicionado ✓' : 'Adicionar ao carrinho'}
            </button>
            <button type="button" className="btn btn--primary" onClick={handleBuyNow}>
              Comprar agora
            </button>
          </div>

          <p className="product-detail__description">{product.description}</p>
        </div>
      </div>
    </div>
  )
}
