import { homeBanners } from '../data/site'
import ImageTextBanner from './ImageTextBanner'

export default function FeatureBanners() {
  return (
    <section className="feature-banners" aria-label="Destaques">
      {homeBanners.map((banner) => (
        <ImageTextBanner key={banner.title} {...banner} />
      ))}
    </section>
  )
}
