import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { isValidName, isValidEmail, isValidPassword } from '../lib/validators'

export default function SignUp() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const validate = () => {
    const errors = {}
    if (!isValidName(firstName)) errors.firstName = 'Digite um nome válido (mínimo 2 letras).'
    if (!isValidName(lastName)) errors.lastName = 'Digite um sobrenome válido (mínimo 2 letras).'
    if (!isValidEmail(email)) errors.email = 'Digite um e-mail válido.'
    if (!isValidPassword(password)) errors.password = 'A senha precisa ter no mínimo 6 caracteres.'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    if (!validate()) return

    setLoading(true)
    const { data, error: signUpError } = await signUp({ email, password, firstName, lastName })
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

        <div className="checkout-form__row">
          <label>
            Nome
            <input
              required
              placeholder="Ex.: Maria"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            {fieldErrors.firstName && <span className="field-error">{fieldErrors.firstName}</span>}
          </label>
          <label>
            Sobrenome
            <input
              required
              placeholder="Ex.: Oliveira"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            {fieldErrors.lastName && <span className="field-error">{fieldErrors.lastName}</span>}
          </label>
        </div>

        <label>
          E-mail
          <input
            type="email"
            required
            placeholder="Ex.: maria@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
        </label>

        <label>
          Senha
          <input
            type="password"
            required
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
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
