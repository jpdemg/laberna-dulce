import { featureBanners } from '../data/site'
import Placeholder from './Placeholder'

export default function FeatureBanners() {
  return (
    <section className="feature-banners" aria-label="Destaques">
      {featureBanners.map((banner, index) => (
        <article
          key={banner.title}
          className={`feature-banner feature-banner--${banner.align}`}
        >
          <Placeholder label={banner.eyebrow} variant={index + 1} className="feature-banner__art" />
          <div className="feature-banner__content">
            <p className="eyebrow">{banner.eyebrow}</p>
            <h2>{banner.title}</h2>
            <a className="btn btn--outline" href={banner.href}>
              {banner.cta}
            </a>
          </div>
        </article>
      ))}
    </section>
  )
}
