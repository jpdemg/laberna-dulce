import { hero } from '../data/site'
import Placeholder from './Placeholder'

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <Placeholder label="foto de destaque" variant={0} className="hero__art" />
      <div className="hero__content">
        <p className="eyebrow">{hero.eyebrow}</p>
        <h1 id="hero-title">{hero.title}</h1>
        <a className="btn btn--primary" href="#best-sellers">
          {hero.cta}
        </a>
      </div>
    </section>
  )
}
