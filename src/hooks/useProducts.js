import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { defaultSizes } from '../data/pricing'

function withSizes(product) {
  return { ...product, sizes: defaultSizes }
}

export function useProductsByCategory(categorySlug) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    supabase
      .from('products')
      .select('*')
      .eq('category', categorySlug)
      .eq('active', true)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (!active) return
        setProducts((data ?? []).map(withSizes))
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [categorySlug])

  return { products, loading }
}

export function useBestSellers() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('best_seller', true)
      .eq('active', true)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        setProducts((data ?? []).map(withSizes))
        setLoading(false)
      })
  }, [])

  return { products, loading }
}

export function useProduct(id) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data }) => {
        setProduct(data ? withSizes(data) : null)
        setLoading(false)
      })
  }, [id])

  return { product, loading }
}

export function useAllActiveProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('products')
      .select('id, name, price, category, images')
      .eq('active', true)
      .then(({ data }) => {
        setProducts(data ?? [])
        setLoading(false)
      })
  }, [])

  return { products, loading }
}

export function useRelatedProducts(category, excludeId) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!category) {
      setProducts([])
      setLoading(false)
      return
    }
    setLoading(true)
    supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .eq('active', true)
      .neq('id', excludeId)
      .limit(4)
      .then(({ data }) => {
        setProducts((data ?? []).map(withSizes))
        setLoading(false)
      })
  }, [category, excludeId])

  return { products, loading }
}

export function useAdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = () => {
    setLoading(true)
    return supabase
      .from('products')
      .select('*')
      .order('category', { ascending: true, nullsFirst: true })
      .order('name', { ascending: true })
      .then(({ data }) => {
        setProducts(data ?? [])
        setLoading(false)
      })
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { products, loading, refresh }
}
