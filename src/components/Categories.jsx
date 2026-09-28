import { Link } from 'react-router-dom'
import { catalogIntro } from '../data/site'
import Placeholder from './Placeholder'
import Daisy from './Daisy'

export default function Categories() {
  return (
    <section className="categories" aria-labelledby="categories-title">
      <header className="categories__intro">
        <Daisy size={48} />
        <h2 id="categories-title">
          {catalogIntro.title}
          <em>{catalogIntro.emphasis}</em>
        </h2>
        <p className="eyebrow">{catalogIntro.subtitle}</p>
        <Link className="btn btn--primary" to={catalogIntro.categories[0].href}>
          {catalogIntro.cta}
        </Link>
      </header>

      <ul className="categories__grid">
        {catalogIntro.categories.map((category, index) => (
          <li key={category.label}>
            <Link to={category.href}>
              <Placeholder label={category.label} variant={index} />
              <h3>{category.label}</h3>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
