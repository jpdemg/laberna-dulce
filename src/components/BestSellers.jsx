import { useBestSellers } from '../hooks/useProducts'
import ProductGrid from './ProductGrid'
import Daisy from './Daisy'

export default function BestSellers() {
  const { products, loading } = useBestSellers()

  if (!loading && products.length === 0) return null

  return (
    <section className="best-sellers" id="best-sellers" aria-labelledby="best-sellers-title">
      <h2 id="best-sellers-title">Best Sellers</h2>
      <div className="best-sellers__caption">
        <Daisy size={28} variant="logo" />
        <p className="eyebrow">seleção dos itens mais apaixonantes da laberna dulce</p>
      </div>
      {loading ? <p>Carregando produtos...</p> : <ProductGrid products={products} />}
    </section>
  )
}
