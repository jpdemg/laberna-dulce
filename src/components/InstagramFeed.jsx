import { instagram } from '../data/site'
import Placeholder from './Placeholder'
import Daisy from './Daisy'

export default function InstagramFeed() {
  return (
    <section className="instagram" aria-labelledby="instagram-title">
      <div className="instagram__intro">
        <Daisy size={44} variant="logo" />
        <h2 id="instagram-title" className="reveal">{instagram.handle}</h2>
        <a className="link-arrow" href={instagram.href}>
          {instagram.cta}
          <svg viewBox="0 0 20 12" aria-hidden="true"><path d="M0 6h18M12 1l6 5-6 5" /></svg>
        </a>
      </div>
      <ul className="instagram__grid">
        {Array.from({ length: 6 }).map((_, index) => (
          <li key={index} className="reveal" style={{ '--reveal-delay': `${(index % 6) * 0.08}s` }}>
            <Placeholder label={`foto do instagram ${index + 1}`} variant={index} reveal={false} />
          </li>
        ))}
      </ul>
    </section>
  )
}
