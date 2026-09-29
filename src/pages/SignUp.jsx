import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { fetchAddressByCep } from '../lib/viacep'
import { isValidName, isValidEmail, isValidPassword, isNotEmpty, isValidCep, isValidBrState } from '../lib/validators'

const emptyAddress = {
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  zip: '',
}

export default function SignUp() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [address, setAddress] = useState(emptyAddress)
  const [cepLoading, setCepLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const updateAddressField = (field) => (event) =>
    setAddress((current) => ({ ...current, [field]: event.target.value }))

  const handleCepChange = (event) => {
    updateAddressField('zip')(event)
    const digits = event.target.value.replace(/\D/g, '')
    if (digits.length === 8) {
      setCepLoading(true)
      fetchAddressByCep(digits).then((found) => {
        setCepLoading(false)
        if (found) setAddress((current) => ({ ...current, ...found }))
      })
    }
  }

  const handleCepBlur = async () => {
    setCepLoading(true)
    const found = await fetchAddressByCep(address.zip)
    setCepLoading(false)
    if (found) setAddress((current) => ({ ...current, ...found }))
  }

  const validate = () => {
    const errors = {}
    if (!isValidName(firstName)) errors.firstName = 'Digite um nome válido (mínimo 2 letras).'
    if (!isValidName(lastName)) errors.lastName = 'Digite um sobrenome válido (mínimo 2 letras).'
    if (!isValidEmail(email)) errors.email = 'Digite um e-mail válido.'
    if (!isValidPassword(password)) errors.password = 'A senha precisa ter no mínimo 6 caracteres.'
    if (!isValidCep(address.zip)) errors.zip = 'Digite um CEP válido, com 8 dígitos.'
    if (!isNotEmpty(address.street)) errors.street = 'Informe o nome da rua.'
    if (!isNotEmpty(address.number)) errors.number = 'Informe o número.'
    if (!isNotEmpty(address.neighborhood)) errors.neighborhood = 'Informe o bairro.'
    if (!isNotEmpty(address.city)) errors.city = 'Informe a cidade.'
    if (!isValidBrState(address.state)) errors.state = 'Use a sigla do estado, com 2 letras (ex.: SP).'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    if (!validate()) return

    setLoading(true)
    const { data, error: signUpError } = await signUp({ email, password, firstName, lastName, address })
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
    <div className="auth-page auth-page--wide">
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

        <fieldset>
          <legend>Endereço de entrega</legend>
          <label>
            CEP {cepLoading && '(buscando endereço...)'}
            <input
              required
              inputMode="numeric"
              placeholder="Ex.: 04530-001"
              value={address.zip}
              onChange={handleCepChange}
              onBlur={handleCepBlur}
            />
            {fieldErrors.zip && <span className="field-error">{fieldErrors.zip}</span>}
          </label>

          <label>
            Rua
            <input
              required
              placeholder="Ex.: Rua Cel. Artur de Paula Ferreira"
              value={address.street}
              onChange={updateAddressField('street')}
            />
            {fieldErrors.street && <span className="field-error">{fieldErrors.street}</span>}
          </label>

          <div className="checkout-form__row">
            <label>
              Número
              <input
                required
                placeholder="Ex.: 135"
                value={address.number}
                onChange={updateAddressField('number')}
              />
              {fieldErrors.number && <span className="field-error">{fieldErrors.number}</span>}
            </label>
            <label>
              Complemento
              <input
                placeholder="Ex.: Apto 45 (opcional)"
                value={address.complement}
                onChange={updateAddressField('complement')}
              />
            </label>
          </div>

          <label>
            Bairro
            <input
              required
              placeholder="Ex.: Vila Nova Conceição"
              value={address.neighborhood}
              onChange={updateAddressField('neighborhood')}
            />
            {fieldErrors.neighborhood && <span className="field-error">{fieldErrors.neighborhood}</span>}
          </label>

          <div className="checkout-form__row">
            <label>
              Cidade
              <input
                required
                placeholder="Ex.: São Paulo"
                value={address.city}
                onChange={updateAddressField('city')}
              />
              {fieldErrors.city && <span className="field-error">{fieldErrors.city}</span>}
            </label>
            <label>
              Estado
              <input
                required
                placeholder="Ex.: SP"
                value={address.state}
                onChange={updateAddressField('state')}
                maxLength={2}
              />
              {fieldErrors.state && <span className="field-error">{fieldErrors.state}</span>}
            </label>
          </div>
        </fieldset>

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
