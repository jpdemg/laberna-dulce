import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import usePageMeta from '../hooks/usePageMeta'

export default function AccountLayout() {
  usePageMeta({ title: 'Minha conta', noindex: true })

  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="account-page">
      <h1 className="reveal">minha conta</h1>
      <p className="account-page__email">{user?.email}</p>

      <nav className="account-tabs" aria-label="Seções da conta">
        <NavLink to="/conta" end>
          Meus dados
        </NavLink>
        <NavLink to="/conta/pedidos">Meus pedidos</NavLink>
        <NavLink to="/conta/favoritos">Favoritos</NavLink>
      </nav>

      <div key={location.pathname} className="tab-content-fade">
        <Outlet />
      </div>

      <button type="button" className="btn btn--outline" onClick={handleSignOut}>
        Sair da conta
      </button>
    </div>
  )
}
