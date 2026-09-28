import { Navigate } from 'react-router-dom'
import { categories } from '../data/site'
import Breadcrumb from '../components/Breadcrumb'
import ProductGrid from '../components/ProductGrid'
import Placeholder from '../components/Placeholder'
import Daisy from '../components/Daisy'

export default function CategoryPage({ slug }) {
  const category = categories[slug]

  if (!category) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="category-page">
      <Breadcrumb label={category.label} />

      <article className="category-banner">
        <Placeholder label={category.label} variant={0} className="category-banner__art" />
        <div className="category-banner__content reveal">
          <Daisy size={36} tone="light" />
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

      <ProductGrid products={category.products} />
    </div>
  )
}
