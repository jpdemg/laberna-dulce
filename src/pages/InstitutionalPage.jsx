import { Navigate } from 'react-router-dom'
import { institutionalPages } from '../data/site'
import usePageMeta from '../hooks/usePageMeta'
import ImageTextBanner from '../components/ImageTextBanner'
import Placeholder from '../components/Placeholder'
import Daisy from '../components/Daisy'

function PlainSection({ title, emphasis, body, imageLabel, reverse }) {
  return (
    <article className={`institutional-plain ${reverse ? 'institutional-plain--reverse' : ''}`}>
      <Placeholder label={imageLabel} variant={2} className="institutional-plain__art" />
      <div className="institutional-plain__content">
        <Daisy size={36} variant="logo" />
        <h2 className="reveal">
          {title}
          {emphasis && <em>{emphasis}</em>}
        </h2>
        {body.map((paragraph) => (
          <p key={paragraph} className="reveal">{paragraph}</p>
        ))}
      </div>
    </article>
  )
}

function GallerySection({ count = 4 }) {
  return (
    <ul className="institutional-gallery">
      {Array.from({ length: count }).map((_, index) => (
        <li key={index} className="reveal" style={{ '--reveal-delay': `${(index % 4) * 0.1}s` }}>
          <Placeholder label={`foto ${index + 1}`} variant={index} reveal={false} />
        </li>
      ))}
    </ul>
  )
}

export default function InstitutionalPage({ slug }) {
  const page = institutionalPages[slug]

  usePageMeta({ title: page?.label })

  if (!page) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="institutional-page">
      <h1 className="sr-only">{page.label}</h1>
      <Placeholder label={page.hero.imageLabel} variant={0} className="institutional-hero" />

      {page.sections.map((section, index) => {
        if (section.type === 'banner') {
          return <ImageTextBanner key={index} tone="dark" {...section} />
        }
        if (section.type === 'plain') {
          return <PlainSection key={index} {...section} />
        }
        if (section.type === 'gallery') {
          return <GallerySection key={index} {...section} />
        }
        return null
      })}
    </div>
  )
}
