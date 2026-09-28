export default function Daisy({ size = 40, tone = 'ink', className = '' }) {
  const petals = Array.from({ length: 12 })
  const color = tone === 'light' ? 'var(--color-bg)' : 'var(--color-ink)'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`daisy ${className}`}
      aria-hidden="true"
    >
      <g fill={color} transform="translate(50 50)">
        {petals.map((_, index) => (
          <ellipse
            key={index}
            cx="0"
            cy="-32"
            rx="7"
            ry="20"
            transform={`rotate(${(360 / petals.length) * index})`}
          />
        ))}
      </g>
    </svg>
  )
}
