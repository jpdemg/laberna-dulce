import { catalogIntro } from '../data/site'
import Placeholder from './Placeholder'

export default function Categories() {
  return (
    <section className="categories" id="produtos" aria-labelledby="categories-title">
      <header className="categories__intro">
        <h2 id="categories-title">{catalogIntro.title}</h2>
        <p>{catalogIntro.subtitle}</p>
        <a className="btn btn--primary" href="#best-sellers">
          {catalogIntro.cta}
        </a>
      </header>

      <ul className="categories__grid">
        {catalogIntro.categories.map((category, index) => (
          <li key={category}>
            <Placeholder label={category} variant={index} />
            <h3>{category}</h3>
          </li>
        ))}
      </ul>
    </section>
  )
}
