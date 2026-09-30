import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb'
import ProductMedia from '../components/ProductMedia'
import StarRating from '../components/StarRating'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useProduct } from '../hooks/useProducts'
import { useProductReviews } from '../hooks/useProductReviews'
import usePageMeta from '../hooks/usePageMeta'
import { categories } from '../data/site'
import { formatBRL } from '../lib/format'

const FALLBACK_GALLERY = [0, 1, 2]

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { user } = useAuth()
  const { product, loading } = useProduct(id)
  const { reviews, average, count, myReview, saving: savingReview, submitReview, deleteReview } =
    useProductReviews(id)

  const [activePhoto, setActivePhoto] = useState(0)
  const [sizeLabel, setSizeLabel] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')
  const [added, setAdded] = useState(false)
  const [reviewRating, setReviewRating] = useState(myReview?.rating ?? 5)
  const [reviewComment, setReviewComment] = useState(myReview?.comment ?? '')
  const [reviewSaved, setReviewSaved] = useState(false)

  useEffect(() => {
    if (myReview) {
      setReviewRating(myReview.rating)
      setReviewComment(myReview.comment ?? '')
    }
  }, [myReview])

  usePageMeta({
    title: product?.name,
    description: product?.description,
  })

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

  const handleSubmitReview = async (event) => {
    event.preventDefault()
    setReviewSaved(false)
    const { error } = await submitReview({ rating: reviewRating, comment: reviewComment })
    if (!error) {
      setReviewSaved(true)
      setTimeout(() => setReviewSaved(false), 2000)
    }
  }

  const handleDeleteReview = async () => {
    if (!myReview) return
    if (!window.confirm('Excluir sua avaliação deste produto?')) return
    await deleteReview(myReview.id)
    setReviewRating(5)
    setReviewComment('')
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

          {count > 0 ? (
            <a href="#avaliacoes" className="product-detail__rating-summary">
              <StarRating value={average} size={16} />
              <span>
                {average.toFixed(1)} ({count} {count === 1 ? 'avaliação' : 'avaliações'})
              </span>
            </a>
          ) : (
            <a href="#avaliacoes" className="product-detail__rating-summary product-detail__rating-summary--empty">
              Seja o primeiro a avaliar
            </a>
          )}

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
            <button
              type="button"
              className={`btn btn--outline icon-add-btn ${added ? 'is-added' : ''}`}
              onClick={handleAddToCart}
            >
              <span className="icon-add-btn__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="icon-add-btn__icon-cart">
                  <path d="M5 8h14l-1.3 11H6.3Z" />
                  <path d="M8.5 8V6a3.5 3.5 0 0 1 7 0v2" />
                </svg>
                <svg viewBox="0 0 24 24" className="icon-add-btn__icon-check">
                  <path
                    d="M5 13l5 5L20 7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              {added ? 'Adicionado' : 'Adicionar ao carrinho'}
            </button>
            <button type="button" className="btn btn--primary" onClick={handleBuyNow}>
              Comprar agora
            </button>
          </div>

          <p className="product-detail__description">{product.description}</p>
        </div>
      </div>

      <section id="avaliacoes" className="product-reviews">
        <h2>Avaliações {count > 0 && `(${count})`}</h2>

        {user ? (
          <form className="product-reviews__form" onSubmit={handleSubmitReview}>
            <p>{myReview ? 'Editar minha avaliação' : 'Deixe sua avaliação'}</p>
            <StarRating value={reviewRating} onChange={setReviewRating} size={26} />
            <textarea
              placeholder="Conte como foi sua experiência com esse produto (opcional)"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              rows={3}
            />
            <div className="product-reviews__form-actions">
              <button
                type="submit"
                className={`btn btn--primary btn--confirm-pulse ${reviewSaved ? 'is-confirmed' : ''}`}
                disabled={savingReview}
              >
                {savingReview ? 'Salvando...' : reviewSaved ? 'Salvo ✓' : myReview ? 'Atualizar avaliação' : 'Enviar avaliação'}
              </button>
              {myReview && (
                <button type="button" className="btn btn--outline" onClick={handleDeleteReview}>
                  Excluir avaliação
                </button>
              )}
            </div>
          </form>
        ) : (
          <p className="product-reviews__login-hint">
            <Link to="/login">Entre na sua conta</Link> pra deixar uma avaliação.
          </p>
        )}

        {reviews.length === 0 ? (
          <p className="product-reviews__empty">Esse produto ainda não tem avaliações.</p>
        ) : (
          <ul className="product-reviews__list">
            {reviews.map((review) => (
              <li key={review.id} className="product-reviews__item">
                <div className="product-reviews__item-header">
                  <StarRating value={review.rating} size={16} />
                  <strong>{review.reviewer_name}</strong>
                  <span className="product-reviews__date">
                    {new Date(review.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                {review.comment && <p>{review.comment}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
