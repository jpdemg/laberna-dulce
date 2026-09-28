import { Link } from 'react-router-dom'
import Placeholder from './Placeholder'
import Daisy from './Daisy'

export default function ImageTextBanner({
  title,
  emphasis,
  eyebrow,
  body,
  cta,
  href,
  imageLabel,
  tone = 'dark',
  reverse = false,
}) {
  const isExternal = href && (href.startsWith('http') || href.startsWith('[') || href.startsWith('#'))

  return (
    <article className={`banner banner--${tone} ${reverse ? 'banner--reverse' : ''}`}>
      <Placeholder label={imageLabel} variant={1} className="banner__art" />
      <div className="banner__content">
        <Daisy size={40} tone={tone === 'dark' ? 'light' : 'ink'} />
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>
          {title}
          {emphasis && <em>{emphasis}</em>}
        </h2>
        {body && <p className="banner__body">{body}</p>}
        {cta && href && (
          isExternal ? (
            <a className={`btn ${tone === 'dark' ? 'btn--light' : 'btn--primary'}`} href={href}>
              {cta}
            </a>
          ) : (
            <Link className={`btn ${tone === 'dark' ? 'btn--light' : 'btn--primary'}`} to={href}>
              {cta}
            </Link>
          )
        )}
      </div>
    </article>
  )
}
