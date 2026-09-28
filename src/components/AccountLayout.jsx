import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AccountLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

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
      </nav>

      <Outlet />

      <button type="button" className="btn btn--outline" onClick={handleSignOut}>
        Sair da conta
      </button>
    </div>
  )
}
