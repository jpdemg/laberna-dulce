import { Link } from 'react-router-dom'
import usePageMeta from '../hooks/usePageMeta'

export default function NotFound() {
  usePageMeta({ title: 'Página não encontrada', noindex: true })

  return (
    <div className="not-found">
      <h1>404</h1>
      <p>Não encontramos essa página.</p>
      <Link className="btn btn--primary" to="/">
        Voltar para a página inicial
      </Link>
    </div>
  )
}
