import { useEffect } from 'react'

const SITE_NAME = 'Laberna Dulce'
const DEFAULT_DESCRIPTION =
  'Laberna Dulce — ateliê de confeitaria em São Paulo. Bolos, docinhos e sobremesas artesanais.'

function setMetaTag(name, content, attr = 'name') {
  if (!content) return
  let tag = document.head.querySelector(`meta[${attr}="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, name)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

export default function usePageMeta({ title, description, noindex = false } = {}) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Ateliê de Confeitaria`

    const finalDescription = description || DEFAULT_DESCRIPTION
    setMetaTag('description', finalDescription)
    setMetaTag('og:title', document.title, 'property')
    setMetaTag('og:description', finalDescription, 'property')
    setMetaTag('og:url', window.location.href, 'property')
    setMetaTag('robots', noindex ? 'noindex, nofollow' : 'index, follow')

    return () => setMetaTag('robots', 'index, follow')
  }, [title, description, noindex])
}
