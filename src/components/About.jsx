import { about } from '../data/site'
import Placeholder from './Placeholder'

export default function About() {
  return (
    <section className="about" id="historia" aria-labelledby="about-title">
      <Placeholder label="foto das sócias" variant={1} className="about__art" />
      <div className="about__content">
        <h2 id="about-title">{about.title}</h2>
        {about.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  )
}
