import Placeholder from './Placeholder'

export default function ProductMedia({ product, variant = 0, className = '', seal = false, tag, reveal = true }) {
  const photo = product.images?.[variant] ?? product.images?.[0]

  if (photo) {
    return (
      <div className={`product-media ${reveal ? 'reveal' : ''} ${className}`}>
        {tag && <span className="placeholder-art__tag">{tag}</span>}
        <img src={photo} alt={product.name} loading="lazy" />
        {seal && (
          <span className="placeholder-art__seal" aria-hidden="true">
            LD
          </span>
        )}
      </div>
    )
  }

  return (
    <Placeholder
      label={product.name}
      variant={variant}
      className={className}
      seal={seal}
      tag={tag}
      reveal={reveal}
    />
  )
}
