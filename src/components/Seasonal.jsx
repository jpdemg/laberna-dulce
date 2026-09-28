import { seasonal } from '../data/site'
import ImageTextBanner from './ImageTextBanner'

export default function Seasonal() {
  return (
    <ImageTextBanner
      tone="dark"
      eyebrow={seasonal.eyebrow}
      title={seasonal.title}
      body={seasonal.subtitle}
      cta={seasonal.cta}
      href={seasonal.href}
      imageLabel={seasonal.title}
    />
  )
}
