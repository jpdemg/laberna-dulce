import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import usePageMeta from '../hooks/usePageMeta'
import useHCaptcha from '../hooks/useHCaptcha'

export default function Login() {
  usePageMeta({ title: 'Entrar', noindex: true })

  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { containerRef, execute, reset } = useHCaptcha()

  const redirectTo = location.state?.from ?? '/conta'

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    let captchaToken
    try {
      captchaToken = await execute()
    } catch {
      setError('Não foi possível validar o captcha. Tente novamente.')
      setLoading(false)
      return
    }

    const { error: signInError } = await signIn({ email, password, captchaToken })
    reset()
    setLoading(false)
    if (signInError) {
      setError(signInError.message)
      return
    }
    navigate(redirectTo, { replace: true })
  }

  return (
    <div className="auth-page">
      <form className="auth-card reveal" onSubmit={handleSubmit}>
        <h1>Entrar</h1>
        <p className="eyebrow">acesse sua conta laberna dulce</p>

        <label>
          E-mail
          <input
            type="email"
            required
            placeholder="Ex.: maria@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          Senha
          <input
            type="password"
            required
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error && <p className="auth-card__error">{error}</p>}

        <div ref={containerRef} />

        <button type="submit" className="btn btn--primary" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        <p className="auth-card__switch">
          Ainda não tem conta? <Link to="/cadastro">Criar conta</Link>
        </p>
      </form>
    </div>
  )
}
