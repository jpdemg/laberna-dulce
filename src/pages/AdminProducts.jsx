import { Link } from 'react-router-dom'
import { useAdminProducts } from '../hooks/useProducts'
import { supabase } from '../lib/supabaseClient'
import { formatBRL } from '../lib/format'
import ProductMedia from '../components/ProductMedia'
import { categories } from '../data/site'

export default function AdminProducts() {
  const { products, loading, refresh } = useAdminProducts()

  const toggleActive = async (product) => {
    await supabase.from('products').update({ active: !product.active }).eq('id', product.id)
    refresh()
  }

  const handleDelete = async (product) => {
    if (!window.confirm(`Remover "${product.name}" do catálogo? Essa ação não pode ser desfeita.`)) return
    await supabase.from('products').delete().eq('id', product.id)
    refresh()
  }

  return (
    <section className="admin-products">
      <div className="admin-products__header">
        <p>{products.length} produtos cadastrados</p>
        <Link className="btn btn--primary" to="/admin/produtos/novo">
          Novo produto
        </Link>
      </div>

      {loading && <p>Carregando...</p>}

      {!loading && (
        <ul className="admin-products__list">
          {products.map((product) => (
            <li key={product.id} className="admin-products__row">
              <ProductMedia product={product} className="admin-products__thumb" reveal={false} />
              <div className="admin-products__info">
                <strong>{product.name}</strong>
                <span className="admin-products__meta">
                  {categories[product.category]?.label ?? (product.best_seller ? 'Best seller' : 'Sem categoria')}
                  {' · '}
                  {formatBRL(product.price)}
                  {!product.active && ' · inativo'}
                </span>
              </div>
              <div className="admin-products__actions">
                <button type="button" className="btn btn--outline" onClick={() => toggleActive(product)}>
                  {product.active ? 'Desativar' : 'Ativar'}
                </button>
                <Link className="btn btn--outline" to={`/admin/produtos/${product.id}`}>
                  Editar
                </Link>
                <button
                  type="button"
                  className="btn btn--outline account-page__cancel"
                  onClick={() => handleDelete(product)}
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
