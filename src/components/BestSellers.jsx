import { bestSellers } from '../data/site'
import ProductGrid from './ProductGrid'
import Daisy from './Daisy'

export default function BestSellers() {
  return (
    <section className="best-sellers" id="best-sellers" aria-labelledby="best-sellers-title">
      <h2 id="best-sellers-title">Best Sellers</h2>
      <div className="best-sellers__caption">
        <Daisy size={28} />
        <p className="eyebrow">seleção dos itens mais apaixonantes da laberna dulce</p>
      </div>
      <ProductGrid products={bestSellers} />
    </section>
  )
}
