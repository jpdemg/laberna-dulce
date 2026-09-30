export default function FavoriteButton({ isFavorite, onToggle, className = '' }) {
  return (
    <button
      type="button"
      className={`favorite-button ${isFavorite ? 'is-favorite' : ''} ${className}`}
      aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      aria-pressed={isFavorite}
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        onToggle()
      }}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 20.5s-7.5-4.6-10-9A5.6 5.6 0 0 1 12 5.3 5.6 5.6 0 0 1 22 11.5c-2.5 4.4-10 9-10 9Z" />
      </svg>
    </button>
  )
}
