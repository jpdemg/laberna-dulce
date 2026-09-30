export default function StarRating({ value = 0, onChange, size = 20 }) {
  const interactive = typeof onChange === 'function'
  const stars = [1, 2, 3, 4, 5]

  return (
    <div className={`star-rating ${interactive ? 'star-rating--interactive' : ''}`} role={interactive ? 'radiogroup' : undefined}>
      {stars.map((star) => {
        const filled = star <= Math.round(value)
        return (
          <button
            key={star}
            type="button"
            className={`star-rating__star ${filled ? 'is-filled' : ''}`}
            style={{ width: size, height: size }}
            onClick={interactive ? () => onChange(star) : undefined}
            disabled={!interactive}
            aria-label={`${star} de 5 estrelas`}
            aria-pressed={interactive ? filled : undefined}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2.5l3 6.1 6.7.9-4.9 4.7 1.2 6.6L12 17.7l-6 3.1 1.2-6.6-4.9-4.7 6.7-.9Z" />
            </svg>
          </button>
        )
      })}
    </div>
  )
}
