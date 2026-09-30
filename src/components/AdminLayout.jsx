import { NavLink, Outlet, useLocation } from 'react-router-dom'
import usePageMeta from '../hooks/usePageMeta'

export default function AdminLayout() {
  usePageMeta({ title: 'Administração', noindex: true })

  const location = useLocation()

  return (
    <div className="admin-page">
      <h1 className="reveal">painel de administração</h1>

      <nav className="account-tabs" aria-label="Seções do admin">
        <NavLink to="/admin" end>
          Produtos
        </NavLink>
        <NavLink to="/admin/pedidos">Pedidos</NavLink>
        <NavLink to="/admin/avaliacoes">Avaliações</NavLink>
        <NavLink to="/admin/metricas">Métricas</NavLink>
      </nav>

      <div key={location.pathname} className="tab-content-fade">
        <Outlet />
      </div>
    </div>
  )
}
