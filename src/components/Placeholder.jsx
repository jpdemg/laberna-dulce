export default function Placeholder({ label = 'foto do produto', variant = 0, className = '' }) {
  const patterns = [
    <path key="cake" d="M20 78 L20 58 Q50 46 80 58 L80 78 Z" />,
    <circle key="macaron" cx="50" cy="50" r="26" />,
    <path key="cupcake" d="M28 50 L72 50 L64 82 L36 82 Z M30 50 Q50 20 70 50" />,
  ]

  return (
    <div className={`placeholder-art ${className}`} role="img" aria-label={label}>
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {patterns[variant % patterns.length]}
      </svg>
      <span>{label}</span>
    </div>
  )
}
