import Placeholder from './Placeholder'

export default function ProductGrid({ products }) {
  return (
    <ul className="product-grid">
      {products.map((product, index) => (
        <li key={product.name} className="product-card">
          <Placeholder label={product.name} variant={index} seal tag={product.tag} />
          <h3>{product.name}</h3>
          <p className="product-card__price">{product.price}</p>
          <button type="button" className="btn btn--add">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 8h14l-1.3 11H6.3Z" />
              <path d="M8.5 8V6a3.5 3.5 0 0 1 7 0v2" />
            </svg>
            Adicionar ao carrinho
          </button>
        </li>
      ))}
    </ul>
  )
}
