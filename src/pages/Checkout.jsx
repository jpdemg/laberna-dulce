import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useProfile } from '../hooks/useProfile'
import { supabase } from '../lib/supabaseClient'
import { formatBRL } from '../lib/format'
import { fetchAddressByCep } from '../lib/viacep'
import PhoneInput from '../components/PhoneInput'
import { isNotEmpty, isValidCep, isValidBrState, isValidPhoneNumber } from '../lib/validators'

const emptyAddress = {
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  zip: '',
}

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const { profile, loading: profileLoading, saveProfile } = useProfile()
  const navigate = useNavigate()
  const [address, setAddress] = useState(emptyAddress)
  const [phoneCountry, setPhoneCountry] = useState('BR')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [cepLoading, setCepLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    if (profile?.address) setAddress((current) => ({ ...current, ...profile.address }))
    if (profile?.phone) setPhoneNumber(profile.phone)
    if (profile?.phone_country) setPhoneCountry(profile.phone_country)
  }, [profile])

  const updateField = (field) => (event) =>
    setAddress((current) => ({ ...current, [field]: event.target.value }))

  const applyCepResult = (found) => {
    if (!found) return
    setAddress((current) => ({ ...current, ...found }))
  }

  const handleCepBlur = async () => {
    setCepLoading(true)
    const found = await fetchAddressByCep(address.zip)
    setCepLoading(false)
    applyCepResult(found)
  }

  const handleCepChange = (event) => {
    updateField('zip')(event)
    const digits = event.target.value.replace(/\D/g, '')
    if (digits.length === 8) {
      setCepLoading(true)
      fetchAddressByCep(digits).then((found) => {
        setCepLoading(false)
        applyCepResult(found)
      })
    }
  }

  const validate = () => {
    const errors = {}
    if (!isValidCep(address.zip)) errors.zip = 'Digite um CEP válido, com 8 dígitos.'
    if (!isNotEmpty(address.street)) errors.street = 'Informe o nome da rua.'
    if (!isNotEmpty(address.number)) errors.number = 'Informe o número.'
    if (!isNotEmpty(address.neighborhood)) errors.neighborhood = 'Informe o bairro.'
    if (!isNotEmpty(address.city)) errors.city = 'Informe a cidade.'
    if (!isValidBrState(address.state)) errors.state = 'Use a sigla do estado, com 2 letras (ex.: SP).'
    if (!isValidPhoneNumber(phoneNumber, phoneCountry)) {
      errors.phone = 'Digite um telefone válido para o país selecionado.'
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handlePay = async (event) => {
    event.preventDefault()
    setError('')
    if (!validate()) return

    setLoading(true)

    await saveProfile({ phone: phoneNumber, phone_country: phoneCountry, address })

    const { data, error: fnError } = await supabase.functions.invoke('create-preference', {
      body: {
        items: items.map((item) => ({ id: item.id, quantity: item.quantity })),
        address: { ...address, phone: phoneNumber, phone_country: phoneCountry },
      },
    })

    setLoading(false)

    if (fnError || !data?.init_point) {
      setError('Não foi possível iniciar o pagamento. Tente novamente em alguns instantes.')
      return
    }

    clearCart()
    window.location.href = data.init_point
  }

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <h1 className="reveal">finalizar compra</h1>
        <p>Seu carrinho está vazio.</p>
        <button type="button" className="btn btn--primary" onClick={() => navigate('/bolos')}>
          Ver produtos
        </button>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <h1 className="reveal">finalizar compra</h1>

      <form className="checkout-form" onSubmit={handlePay}>
        <fieldset>
          <legend>Endereço de entrega</legend>
          <label>
            E-mail
            <input value={user?.email ?? ''} disabled />
          </label>

          <label>
            CEP {cepLoading && '(buscando endereço...)'}
            {profileLoading && '(carregando dados salvos...)'}
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
              onChange={updateField('street')}
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
                onChange={updateField('number')}
              />
              {fieldErrors.number && <span className="field-error">{fieldErrors.number}</span>}
            </label>
            <label>
              Complemento
              <input
                placeholder="Ex.: Apto 45 (opcional)"
                value={address.complement}
                onChange={updateField('complement')}
              />
            </label>
          </div>
          <label>
            Bairro
            <input
              required
              placeholder="Ex.: Vila Nova Conceição"
              value={address.neighborhood}
              onChange={updateField('neighborhood')}
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
                onChange={updateField('city')}
              />
              {fieldErrors.city && <span className="field-error">{fieldErrors.city}</span>}
            </label>
            <label>
              Estado
              <input
                required
                placeholder="Ex.: SP"
                value={address.state}
                onChange={updateField('state')}
                maxLength={2}
              />
              {fieldErrors.state && <span className="field-error">{fieldErrors.state}</span>}
            </label>
          </div>

          <PhoneInput
            country={phoneCountry}
            number={phoneNumber}
            onCountryChange={setPhoneCountry}
            onNumberChange={setPhoneNumber}
            error={fieldErrors.phone}
          />

          <p className="checkout-form__hint">
            Salvamos esse endereço na sua conta para a próxima compra.
          </p>
        </fieldset>

        <div className="cart-summary">
          <span>Total</span>
          <strong>{formatBRL(subtotal)}</strong>
        </div>

        {error && <p className="auth-card__error">{error}</p>}

        <button type="submit" className="btn btn--primary" disabled={loading}>
          {loading ? 'Redirecionando...' : 'Pagar com Mercado Pago'}
        </button>
      </form>
    </div>
  )
}
