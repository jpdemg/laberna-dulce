import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

export function useFavoriteIds() {
  const { user } = useAuth()
  const [ids, setIds] = useState(new Set())
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    if (!user) {
      setIds(new Set())
      setLoading(false)
      return Promise.resolve()
    }
    setLoading(true)
    return supabase
      .from('favorites')
      .select('product_id')
      .then(({ data }) => {
        setIds(new Set((data ?? []).map((row) => row.product_id)))
        setLoading(false)
      })
  }, [user])

  useEffect(() => {
    refresh()
  }, [refresh])

  const isFavorite = (productId) => ids.has(productId)

  const toggleFavorite = async (productId) => {
    if (!user) return { error: new Error('Sem usuário autenticado') }

    if (ids.has(productId)) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId)
      if (!error) setIds((current) => new Set([...current].filter((id) => id !== productId)))
      return { error }
    }

    const { error } = await supabase.from('favorites').insert({ user_id: user.id, product_id: productId })
    if (!error) setIds((current) => new Set([...current, productId]))
    return { error }
  }

  return { ids, loading, isFavorite, toggleFavorite, refresh }
}

export function useFavoriteProducts() {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    if (!user) {
      setProducts([])
      setLoading(false)
      return Promise.resolve()
    }
    setLoading(true)
    return supabase
      .from('favorites')
      .select('created_at, products(*)')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setProducts((data ?? []).map((row) => row.products).filter(Boolean))
        setLoading(false)
      })
  }, [user])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { products, loading, refresh }
}
