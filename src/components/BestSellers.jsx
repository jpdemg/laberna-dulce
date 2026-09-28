import { bestSellers } from '../data/site'
import Placeholder from './Placeholder'

export default function BestSellers() {
  return (
    <section className="best-sellers" id="best-sellers" aria-labelledby="best-sellers-title">
      <h2 id="best-sellers-title">Best Sellers</h2>
      <ul className="best-sellers__grid">
        {bestSellers.map((product, index) => (
          <li key={product.name} className="product-card">
            <Placeholder label={product.name} variant={index} />
            <h3>{product.name}</h3>
            <p className="product-card__price">{product.price}</p>
            <button type="button" className="btn btn--outline">
              adicionar
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
