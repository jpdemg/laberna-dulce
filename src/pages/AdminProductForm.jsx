import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { generateProductId } from '../lib/slugify'
import { categories } from '../data/site'

const emptyProduct = {
  id: '',
  name: '',
  price: '',
  category: 'bolos',
  tag: '',
  description: '',
  best_seller: false,
  active: true,
  images: [],
}

export default function AdminProductForm() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [product, setProduct] = useState(emptyProduct)
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEditing) return
    supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        if (data) setProduct({ ...data, price: String(data.price) })
        setLoading(false)
      })
  }, [id, isEditing])

  const updateField = (field) => (event) =>
    setProduct((current) => ({ ...current, [field]: event.target.value }))

  const handlePhotoUpload = async (event) => {
    const files = Array.from(event.target.files ?? [])
    if (files.length === 0) return

    const productId = product.id || generateProductId(product.name)
    if (!product.id) setProduct((current) => ({ ...current, id: productId }))

    setUploading(true)
    const uploadedUrls = []

    for (const file of files) {
      const path = `${productId}/${Date.now()}-${file.name}`
      const { error: uploadError } = await supabase.storage
        .from('product-photos')
        .upload(path, file, { cacheControl: '3600', upsert: false })

      if (!uploadError) {
        const { data } = supabase.storage.from('product-photos').getPublicUrl(path)
        uploadedUrls.push(data.publicUrl)
      }
    }

    setProduct((current) => ({ ...current, images: [...current.images, ...uploadedUrls] }))
    setUploading(false)
  }

  const removePhoto = (url) => {
    setProduct((current) => ({ ...current, images: current.images.filter((image) => image !== url) }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const price = Number(product.price)
    if (!product.name.trim() || Number.isNaN(price) || price <= 0) {
      setError('Preencha o nome e um preço válido.')
      return
    }

    setSaving(true)

    const productId = product.id || generateProductId(product.name)
    const payload = {
      id: productId,
      name: product.name.trim(),
      price,
      category: product.category || null,
      tag: product.tag?.trim() || null,
      description: product.description?.trim() || null,
      best_seller: product.best_seller,
      active: product.active,
      images: product.images,
    }

    const { error: saveError } = await supabase.from('products').upsert(payload)

    setSaving(false)

    if (saveError) {
      setError('Não foi possível salvar o produto. Tente novamente.')
      return
    }

    navigate('/admin')
  }

  if (loading) return <p>Carregando...</p>

  return (
    <form className="checkout-form admin-product-form" onSubmit={handleSubmit}>
      <fieldset>
        <legend>{isEditing ? 'Editar produto' : 'Novo produto'}</legend>

        <label>
          Nome
          <input
            required
            placeholder="Ex.: Bolo de Chocolate com Ganache"
            value={product.name}
            onChange={updateField('name')}
          />
        </label>

        <div className="checkout-form__row">
          <label>
            Preço (tamanho M, em R$)
            <input
              required
              type="number"
              step="0.01"
              min="0"
              placeholder="Ex.: 89.90"
              value={product.price}
              onChange={updateField('price')}
            />
          </label>
          <label>
            Categoria
            <select value={product.category ?? ''} onChange={updateField('category')}>
              <option value="">Sem categoria (só best seller)</option>
              {Object.values(categories).map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label>
          Etiqueta (opcional)
          <input
            placeholder="Ex.: Homemade, Best seller, Geléia ou fruta"
            value={product.tag ?? ''}
            onChange={updateField('tag')}
          />
        </label>

        <label>
          Descrição
          <textarea rows={4} value={product.description ?? ''} onChange={updateField('description')} />
        </label>

        <label className="admin-product-form__checkbox">
          <input
            type="checkbox"
            checked={product.best_seller}
            onChange={(e) => setProduct((current) => ({ ...current, best_seller: e.target.checked }))}
          />
          Mostrar na vitrine de Best Sellers da home
        </label>

        <label className="admin-product-form__checkbox">
          <input
            type="checkbox"
            checked={product.active}
            onChange={(e) => setProduct((current) => ({ ...current, active: e.target.checked }))}
          />
          Produto ativo (visível no site)
        </label>
      </fieldset>

      <fieldset>
        <legend>Fotos</legend>
        <p className="admin-product-form__hint">
          O site recorta a foto pra caber num quadro de proporção 4:3 (largura : altura). Pra evitar
          que partes importantes fiquem cortadas, envie fotos já nessa proporção, por exemplo 1600×1200
          ou 1200×900, com o produto centralizado.
        </p>
        <div className="admin-product-form__photos">
          {product.images.map((url) => (
            <div key={url} className="admin-product-form__photo">
              <img src={url} alt="" />
              <button type="button" onClick={() => removePhoto(url)}>
                Remover
              </button>
            </div>
          ))}
        </div>
        <label>
          {uploading ? 'Enviando fotos...' : 'Adicionar fotos'}
          <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} disabled={uploading} />
        </label>
      </fieldset>

      {error && <p className="auth-card__error">{error}</p>}

      <div className="product-detail__actions">
        <button type="button" className="btn btn--outline" onClick={() => navigate('/admin')}>
          Cancelar
        </button>
        <button type="submit" className="btn btn--primary" disabled={saving || uploading}>
          {saving ? 'Salvando...' : 'Salvar produto'}
        </button>
      </div>
    </form>
  )
}
