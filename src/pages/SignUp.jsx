import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function SignUp() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    const { data, error: signUpError } = await signUp({ email, password, name })
    setLoading(false)

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    if (data.session) {
      navigate('/conta', { replace: true })
      return
    }

    setDone(true)
  }

  if (done) {
    return (
      <div className="auth-page">
        <div className="auth-card reveal">
          <h1>Confirme seu e-mail</h1>
          <p>Enviamos um link de confirmação para {email}. Clique nele para ativar sua conta.</p>
          <Link className="btn btn--primary" to="/login">
            Ir para o login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <form className="auth-card reveal" onSubmit={handleSubmit}>
        <h1>Criar conta</h1>
        <p className="eyebrow">para acompanhar seus pedidos na laberna dulce</p>

        <label>
          Nome
          <input required value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <label>
          E-mail
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>

        <label>
          Senha
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error && <p className="auth-card__error">{error}</p>}

        <button type="submit" className="btn btn--primary" disabled={loading}>
          {loading ? 'Criando...' : 'Criar conta'}
        </button>

        <p className="auth-card__switch">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </form>
    </div>
  )
}
