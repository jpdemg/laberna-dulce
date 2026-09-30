import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import usePageMeta from '../hooks/usePageMeta'
import { isValidPassword, getPasswordRequirements } from '../lib/validators'

export default function ResetPassword() {
  usePageMeta({ title: 'Redefinir senha', noindex: true })

  const { updatePassword } = useAuth()
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)
  const [validLink, setValidLink] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setValidLink(Boolean(data.session))
      setChecking(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setValidLink(true)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!isValidPassword(password)) {
      setError('A senha precisa cumprir todos os requisitos abaixo.')
      return
    }

    setLoading(true)
    const { error: updateError } = await updatePassword(password)
    setLoading(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    navigate('/', { replace: true })
  }

  if (checking) {
    return <div className="auth-page">Verificando link...</div>
  }

  if (!validLink) {
    return (
      <div className="auth-page">
        <div className="auth-card reveal">
          <h1>Link inválido ou expirado</h1>
          <p>Peça um novo link de redefinição de senha e tente de novo.</p>
          <Link className="btn btn--primary" to="/esqueci-senha">
            Solicitar novo link
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <form className="auth-card reveal" onSubmit={handleSubmit}>
        <h1>Nova senha</h1>
        <p className="eyebrow">escolha uma nova senha pra sua conta</p>

        <label>
          Nova senha
          <input
            type="password"
            required
            placeholder="Ex.: Docinho#25"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <ul className="password-requirements">
            {getPasswordRequirements(password).map((requirement) => (
              <li
                key={requirement.key}
                className={`password-requirements__item ${requirement.met ? 'is-met' : ''}`}
              >
                <span className="password-requirements__icon" aria-hidden="true">
                  {requirement.met ? '✓' : '○'}
                </span>
                {requirement.label}
              </li>
            ))}
          </ul>
        </label>

        {error && <p className="auth-card__error">{error}</p>}

        <button type="submit" className="btn btn--primary" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar nova senha'}
        </button>
      </form>
    </div>
  )
}
