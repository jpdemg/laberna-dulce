import { Link } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid'
import { useFavoriteProducts } from '../hooks/useFavorites'
import { defaultSizes } from '../data/pricing'

export default function AccountFavorites() {
  const { products, loading } = useFavoriteProducts()

  return (
    <section className="account-page__favorites">
      {loading && <p>Carregando...</p>}
      {!loading && products.length === 0 && (
        <p>
          Você ainda não favoritou nenhum produto.{' '}
          <Link to="/bolos">Ver o catálogo</Link>
        </p>
      )}
      {!loading && products.length > 0 && (
        <ProductGrid products={products.map((product) => ({ ...product, sizes: defaultSizes }))} />
      )}
    </section>
  )
}
