import { Navigate } from 'react-router-dom'
import { categories } from '../data/site'
import { useProductsByCategory } from '../hooks/useProducts'
import Breadcrumb from '../components/Breadcrumb'
import ProductGrid from '../components/ProductGrid'
import ProductMedia from '../components/ProductMedia'
import Daisy from '../components/Daisy'

export default function CategoryPage({ slug }) {
  const category = categories[slug]
  const { products, loading } = useProductsByCategory(slug)

  if (!category) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="category-page">
      <Breadcrumb label={category.label} />

      <article className="category-banner">
        <ProductMedia
          product={{ name: category.label, images: [] }}
          variant={0}
          className="category-banner__art"
          reveal={false}
        />
        <div className="category-banner__content reveal">
          <Daisy size={36} tone="light" variant="badge" />
          <p className="eyebrow">{category.banner.eyebrow}</p>
          <p>{category.banner.body}</p>
        </div>
      </article>

      <div className="category-page__toolbar">
        <h1 className="reveal">{category.label}</h1>
        <label className="category-page__sort">
          Ordenar:
          <select defaultValue="relevancia">
            <option value="relevancia">Relevância</option>
            <option value="menor-preco">Menor preço</option>
            <option value="maior-preco">Maior preço</option>
          </select>
        </label>
      </div>

      {loading && <p className="category-page__loading">Carregando produtos...</p>}
      {!loading && products.length === 0 && (
        <p className="category-page__loading">Ainda não temos produtos cadastrados nessa categoria.</p>
      )}
      {!loading && products.length > 0 && <ProductGrid products={products} />}
    </div>
  )
}
