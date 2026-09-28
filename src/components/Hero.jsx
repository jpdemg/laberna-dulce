import { useState } from 'react'
import { Link } from 'react-router-dom'
import { hero } from '../data/site'
import Placeholder from './Placeholder'

export default function Hero() {
  const [index, setIndex] = useState(0)
  const slide = hero.slides[index]
  const isExternal = slide.href.startsWith('#')

  const go = (delta) => {
    setIndex((current) => (current + delta + hero.slides.length) % hero.slides.length)
  }

  return (
    <section className="hero" aria-labelledby="hero-title">
      <Placeholder label="foto de destaque" variant={index} className="hero__art" />

      <div className="hero__card">
        <p className="eyebrow">{slide.eyebrow}</p>
        <h1 id="hero-title">{slide.title}</h1>
        {isExternal ? (
          <a className="link-arrow" href={slide.href}>
            {slide.cta}
            <svg viewBox="0 0 20 12" aria-hidden="true"><path d="M0 6h18M12 1l6 5-6 5" /></svg>
          </a>
        ) : (
          <Link className="link-arrow" to={slide.href}>
            {slide.cta}
            <svg viewBox="0 0 20 12" aria-hidden="true"><path d="M0 6h18M12 1l6 5-6 5" /></svg>
          </Link>
        )}
      </div>

      {hero.slides.length > 1 && (
        <>
          <button className="hero__arrow hero__arrow--prev" aria-label="Slide anterior" onClick={() => go(-1)}>
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12 3 5 10l7 7" /></svg>
          </button>
          <button className="hero__arrow hero__arrow--next" aria-label="Próximo slide" onClick={() => go(1)}>
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M8 3l7 7-7 7" /></svg>
          </button>
        </>
      )}
    </section>
  )
}
