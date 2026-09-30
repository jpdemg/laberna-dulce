import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb'
import ProductMedia from '../components/ProductMedia'
import { useCart } from '../context/CartContext'
import { useProduct } from '../hooks/useProducts'
import { categories } from '../data/site'
import { formatBRL } from '../lib/format'

const FALLBACK_GALLERY = [0, 1, 2]

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { product, loading } = useProduct(id)

  const [activePhoto, setActivePhoto] = useState(0)
  const [sizeLabel, setSizeLabel] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')
  const [added, setAdded] = useState(false)

  if (loading) {
    return <div className="product-detail">Carregando...</div>
  }

  if (!product) {
    return <Navigate to="/" replace />
  }

  const currentSizeLabel = sizeLabel ?? product.sizes[1]?.label ?? product.sizes[0].label
  const selectedSize = product.sizes.find((size) => size.label === currentSizeLabel) ?? product.sizes[0]
  const unitPrice = product.price * selectedSize.multiplier
  const categoryLabel = categories[product.category]?.label ?? null
  const gallery = product.images?.length > 0 ? product.images.map((_, index) => index) : FALLBACK_GALLERY

  const showPhoto = (index) => setActivePhoto((index + gallery.length) % gallery.length)
  const showPrevPhoto = () => showPhoto(activePhoto - 1)
  const showNextPhoto = () => showPhoto(activePhoto + 1)

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
          <div className="product-detail__main-wrap">
            <ProductMedia
              key={activePhoto}
              product={product}
              variant={activePhoto}
              seal
              className="product-detail__main-photo"
              reveal={false}
            />
            {gallery.length > 1 && (
              <>
                <button
                  type="button"
                  className="product-detail__nav product-detail__nav--prev"
                  onClick={showPrevPhoto}
                  aria-label="Foto anterior"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path
                      d="M15 5l-7 7 7 7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  className="product-detail__nav product-detail__nav--next"
                  onClick={showNextPhoto}
                  aria-label="Próxima foto"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path
                      d="M9 5l7 7-7 7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>
          <div className="product-detail__thumbs">
            {gallery.map((variant, index) => (
              <button
                key={variant}
                type="button"
                className={`product-detail__thumb ${index === activePhoto ? 'is-active' : ''}`}
                onClick={() => setActivePhoto(index)}
                aria-label={`Ver foto ${index + 1}`}
              >
                <ProductMedia product={product} variant={variant} reveal={false} />
              </button>
            ))}
          </div>
        </div>

        <div className="product-detail__info">
          {categoryLabel && <p className="eyebrow">{categoryLabel}</p>}
          <h1>{product.name}</h1>
          <p className="product-detail__price">{formatBRL(unitPrice)}</p>

          <div className="product-detail__field">
            <span>Tamanho</span>
            <div className="size-selector">
              {product.sizes.map((size) => (
                <button
                  key={size.label}
                  type="button"
                  className={`size-selector__option ${size.label === currentSizeLabel ? 'is-active' : ''}`}
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
