import { about } from '../data/site'
import { Link } from 'react-router-dom'
import Placeholder from './Placeholder'
import Daisy from './Daisy'

export default function About() {
  return (
    <section className="about" aria-labelledby="about-title">
      <Placeholder label="foto das sócias" variant={1} className="about__art" />
      <div className="about__content">
        <Daisy size={40} />
        <h2 id="about-title" className="reveal">{about.title}</h2>
        {about.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <Link className="link-arrow" to="/atelie">
          Conheça nosso ateliê
          <svg viewBox="0 0 20 12" aria-hidden="true"><path d="M0 6h18M12 1l6 5-6 5" /></svg>
        </Link>
      </div>
    </section>
  )
}
