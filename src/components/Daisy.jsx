import logoMark from '../assets/logo-mark.png'
import logoBadge from '../assets/logo-mark-badge.png'

export default function Daisy({ size = 40, tone = 'ink', variant = 'logo', className = '' }) {
  const displaySize = Math.max(size * 4.5, 180)
  const src = variant === 'badge' ? logoBadge : logoMark

  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className={`daisy ${className}`}
      style={{
        width: displaySize,
        height: displaySize,
        objectFit: 'contain',
        filter: tone === 'light' ? 'none' : 'invert(1)',
      }}
    />
  )
}
