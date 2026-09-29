import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useProfile } from '../hooks/useProfile'

export default function ProtectedAdminRoute({ children }) {
  const { user, loading: authLoading } = useAuth()
  const { profile, loading: profileLoading } = useProfile()
  const location = useLocation()

  if (authLoading || profileLoading) {
    return <div className="auth-page">Carregando...</div>
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (!profile?.is_admin) {
    return <Navigate to="/" replace />
  }

  return children
}
