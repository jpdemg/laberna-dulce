import { seasonal } from '../data/site'
import Placeholder from './Placeholder'

export default function Seasonal() {
  return (
    <section className="seasonal" aria-labelledby="seasonal-title">
      <Placeholder label={seasonal.title} variant={2} className="seasonal__art" />
      <div className="seasonal__content">
        <p className="eyebrow">{seasonal.eyebrow}</p>
        <h2 id="seasonal-title">{seasonal.title}</h2>
        <p className="seasonal__subtitle">{seasonal.subtitle}</p>
        <a className="btn btn--primary" href="#best-sellers">
          {seasonal.cta}
        </a>
      </div>
    </section>
  )
}
