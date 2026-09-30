import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

export function useProductReviews(productId) {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const refresh = useCallback(() => {
    setLoading(true)
    return supabase
      .from('product_reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setReviews(data ?? [])
        setLoading(false)
      })
  }, [productId])

  useEffect(() => {
    refresh()
  }, [refresh])

  const myReview = reviews.find((review) => review.user_id === user?.id) ?? null
  const count = reviews.length
  const average = count > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / count : 0

  const submitReview = async ({ rating, comment }) => {
    if (!user) return { error: new Error('Sem usuário autenticado') }

    const reviewerName =
      [user.user_metadata?.first_name, user.user_metadata?.last_name].filter(Boolean).join(' ') ||
      'Cliente Laberna Dulce'

    setSaving(true)
    const { error } = await supabase.from('product_reviews').upsert(
      {
        product_id: productId,
        user_id: user.id,
        reviewer_name: reviewerName,
        rating,
        comment: comment?.trim() || null,
      },
      { onConflict: 'product_id,user_id' },
    )
    setSaving(false)

    if (!error) await refresh()
    return { error }
  }

  const deleteReview = async (reviewId) => {
    setSaving(true)
    const { error } = await supabase.from('product_reviews').delete().eq('id', reviewId)
    setSaving(false)
    if (!error) await refresh()
    return { error }
  }

  return { reviews, loading, saving, average, count, myReview, submitReview, deleteReview }
}
