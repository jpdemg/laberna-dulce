import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import StarRating from '../components/StarRating'

export default function AdminReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  const loadReviews = () => {
    setLoading(true)
    supabase
      .from('product_reviews')
      .select('*, products(name)')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setReviews(data ?? [])
        setLoading(false)
      })
  }

  useEffect(loadReviews, [])

  const handleDelete = (review) => {
    if (!window.confirm(`Excluir a avaliação de "${review.reviewer_name}"?`)) return
    setDeletingId(review.id)
    setTimeout(async () => {
      await supabase.from('product_reviews').delete().eq('id', review.id)
      loadReviews()
      setDeletingId(null)
    }, 250)
  }

  return (
    <section className="admin-reviews">
      {loading && <p>Carregando...</p>}
      {!loading && reviews.length === 0 && <p>Ainda não há avaliações no site.</p>}

      {!loading && reviews.length > 0 && (
        <ul className="admin-reviews__list">
          {reviews.map((review) => (
            <li
              key={review.id}
              className={`admin-reviews__row ${deletingId === review.id ? 'is-removing' : ''}`}
            >
              <div className="admin-reviews__info">
                <div className="admin-reviews__header">
                  <StarRating value={review.rating} size={16} />
                  <strong>{review.reviewer_name}</strong>
                  <Link to={`/produto/${review.product_id}`}>{review.products?.name ?? review.product_id}</Link>
                  <span className="admin-reviews__date">
                    {new Date(review.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                {review.comment && <p>{review.comment}</p>}
              </div>
              <button
                type="button"
                className="btn btn--outline account-page__cancel"
                disabled={deletingId === review.id}
                onClick={() => handleDelete(review)}
              >
                {deletingId === review.id ? 'Excluindo...' : 'Excluir'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
