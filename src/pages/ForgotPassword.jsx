import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import usePageMeta from '../hooks/usePageMeta'
import useHCaptcha from '../hooks/useHCaptcha'
import { isValidEmail } from '../lib/validators'

export default function ForgotPassword() {
  usePageMeta({ title: 'Recuperar senha', noindex: true })

  const { requestPasswordReset } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { containerRef, execute, reset } = useHCaptcha()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!isValidEmail(email)) {
      setError('Digite um e-mail válido.')
      return
    }

    setLoading(true)

    let captchaToken
    try {
      captchaToken = await execute()
    } catch {
      setError('Não foi possível validar o captcha. Tente novamente.')
      setLoading(false)
      return
    }

    const { error: resetError } = await requestPasswordReset({ email, captchaToken })
    reset()
    setLoading(false)

    if (resetError) {
      setError(resetError.message)
      return
    }

    setSent(true)
  }

  if (sent) {
    return (
      <div className="auth-page">
        <div className="auth-card reveal">
          <h1>Verifique seu e-mail</h1>
          <p>
            Se {email} tiver uma conta na Laberna Dulce, enviamos um link pra redefinir a senha. Ele
            expira em algumas horas.
          </p>
          <Link className="btn btn--primary" to="/login">
            Voltar para o login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <form className="auth-card reveal" onSubmit={handleSubmit}>
        <h1>Recuperar senha</h1>
        <p className="eyebrow">enviamos um link pra você criar uma nova senha</p>

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

        {error && <p className="auth-card__error">{error}</p>}

        <div ref={containerRef} />

        <button type="submit" className="btn btn--primary" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar link'}
        </button>

        <p className="auth-card__switch">
          <Link to="/login">Voltar para o login</Link>
        </p>
      </form>
    </div>
  )
}
