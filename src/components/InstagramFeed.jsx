import { instagram } from '../data/site'
import Placeholder from './Placeholder'

export default function InstagramFeed() {
  return (
    <section className="instagram" aria-labelledby="instagram-title">
      <h2 id="instagram-title">{instagram.handle}</h2>
      <a className="instagram__follow" href="[LINK_INSTAGRAM]">
        {instagram.cta}
      </a>
      <ul className="instagram__grid">
        {Array.from({ length: 6 }).map((_, index) => (
          <li key={index}>
            <Placeholder label={`foto do instagram ${index + 1}`} variant={index} />
          </li>
        ))}
      </ul>
    </section>
  )
}
