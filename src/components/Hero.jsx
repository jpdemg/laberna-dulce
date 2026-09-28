import { Link } from 'react-router-dom'
import { hero } from '../data/site'
import MorphSlider from './MorphSlider'
import { heroPlaceholderPhotos } from '../lib/placeholderPhotos'

export default function Hero() {
  const slide = hero.slides[0]
  const isExternal = slide.href.startsWith('#')

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__art">
        <MorphSlider
          items={heroPlaceholderPhotos}
          transition="melt"
          duration={1.4}
          autoplay
          autoplayDelay={5}
          radius={0}
          overlayColor="#11110f"
        />
      </div>

      <div className="hero__card">
        <p className="eyebrow reveal">{slide.eyebrow}</p>
        <h1 id="hero-title" className="reveal" style={{ '--reveal-delay': '0.15s' }}>
          {slide.title}
        </h1>
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
    </section>
  )
}
