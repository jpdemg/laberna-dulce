import { Link } from 'react-router-dom'

export default function Breadcrumb({ label }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <Link to="/">Página inicial</Link>
      <span aria-hidden="true">›</span>
      <span aria-current="page">{label}</span>
    </nav>
  )
}
