import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useProfile } from '../hooks/useProfile'
import { supabase } from '../lib/supabaseClient'
import { formatBRL } from '../lib/format'
import PhoneInput from '../components/PhoneInput'
import {
  isNotEmpty,
  isValidBrState,
  isValidCep,
  isValidName,
  isValidPhoneNumber,
} from '../lib/validators'

const statusLabels = {
  pending: 'Aguardando pagamento',
  paid: 'Pagamento aprovado',
  cancelled: 'Cancelado',
}

const paymentMethodLabels = {
  pix: 'Pix',
  credit_card: 'Cartão de crédito',
  debit_card: 'Cartão de débito',
  ticket: 'Boleto',
  bank_transfer: 'Transferência',
}

const emptyAddress = {
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  zip: '',
}

export default function Account() {
  const { user, signOut } = useAuth()
  const { profile, loading: profileLoading, saveProfile } = useProfile()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(true)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneCountry, setPhoneCountry] = useState('BR')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [address, setAddress] = useState(emptyAddress)
  const [fieldErrors, setFieldErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!profile) return
    setFirstName(profile.first_name ?? '')
    setLastName(profile.last_name ?? '')
    setPhoneNumber(profile.phone ?? '')
    setPhoneCountry(profile.phone_country ?? 'BR')
    setAddress({ ...emptyAddress, ...(profile.address ?? {}) })
  }, [profile])

  useEffect(() => {
    if (!user) return
    supabase
      .from('orders')
      .select('id, created_at, total, status, payment_method, checkout_url')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setOrders(data ?? [])
        setOrdersLoading(false)
      })
  }, [user])

  const updateAddressField = (field) => (event) =>
    setAddress((current) => ({ ...current, [field]: event.target.value }))

  const validate = () => {
    const errors = {}
    if (!isValidName(firstName)) errors.firstName = 'Digite um nome válido (mínimo 2 letras).'
    if (!isValidName(lastName)) errors.lastName = 'Digite um sobrenome válido (mínimo 2 letras).'
    if (phoneNumber && !isValidPhoneNumber(phoneNumber, phoneCountry)) {
      errors.phone = 'Digite um telefone válido para o país selecionado.'
    }
    const hasAnyAddress = Object.values(address).some(isNotEmpty)
    if (hasAnyAddress) {
      if (!isValidCep(address.zip)) errors.zip = 'Digite um CEP válido, com 8 dígitos.'
      if (!isNotEmpty(address.street)) errors.street = 'Informe o nome da rua.'
      if (!isNotEmpty(address.number)) errors.number = 'Informe o número.'
      if (!isNotEmpty(address.neighborhood)) errors.neighborhood = 'Informe o bairro.'
      if (!isNotEmpty(address.city)) errors.city = 'Informe a cidade.'
      if (!isValidBrState(address.state)) errors.state = 'Use a sigla do estado, com 2 letras (ex.: SP).'
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSaveProfile = async (event) => {
    event.preventDefault()
    setSaved(false)
    if (!validate()) return

    setSaving(true)
    await saveProfile({
      first_name: firstName,
      last_name: lastName,
      name: `${firstName} ${lastName}`.trim(),
      phone: phoneNumber,
      phone_country: phoneCountry,
      address,
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="account-page">
      <h1 className="reveal">minha conta</h1>
      <p className="account-page__email">{user?.email}</p>

      <section className="account-page__profile">
        <h2>Meus dados</h2>
        <form onSubmit={handleSaveProfile} className="checkout-form">
          <fieldset>
            <legend>Cadastro</legend>
            <div className="checkout-form__row">
              <label>
                Nome
                <input
                  placeholder="Ex.: Maria"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                {fieldErrors.firstName && <span className="field-error">{fieldErrors.firstName}</span>}
              </label>
              <label>
                Sobrenome
                <input
                  placeholder="Ex.: Oliveira"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                {fieldErrors.lastName && <span className="field-error">{fieldErrors.lastName}</span>}
              </label>
            </div>

            <PhoneInput
              country={phoneCountry}
              number={phoneNumber}
              onCountryChange={setPhoneCountry}
              onNumberChange={setPhoneNumber}
              error={fieldErrors.phone}
            />
          </fieldset>

          <fieldset>
            <legend>Endereço de entrega salvo</legend>
            <label>
              CEP
              <input
                placeholder="Ex.: 04530-001"
                value={address.zip}
                onChange={updateAddressField('zip')}
              />
              {fieldErrors.zip && <span className="field-error">{fieldErrors.zip}</span>}
            </label>
            <label>
              Rua
              <input
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
                  placeholder="Ex.: São Paulo"
                  value={address.city}
                  onChange={updateAddressField('city')}
                />
                {fieldErrors.city && <span className="field-error">{fieldErrors.city}</span>}
              </label>
              <label>
                Estado
                <input
                  placeholder="Ex.: SP"
                  value={address.state}
                  onChange={updateAddressField('state')}
                  maxLength={2}
                />
                {fieldErrors.state && <span className="field-error">{fieldErrors.state}</span>}
              </label>
            </div>
          </fieldset>

          {profile?.last_payment_method && (
            <p className="checkout-form__hint">
              Último método de pagamento usado:{' '}
              {paymentMethodLabels[profile.last_payment_method] ?? profile.last_payment_method}
            </p>
          )}

          <button type="submit" className="btn btn--primary" disabled={saving || profileLoading}>
            {saving ? 'Salvando...' : saved ? 'Salvo ✓' : 'Salvar dados'}
          </button>
        </form>
      </section>

      <section className="account-page__orders">
        <h2>Meus pedidos</h2>
        {ordersLoading && <p>Carregando pedidos...</p>}
        {!ordersLoading && orders.length === 0 && <p>Você ainda não fez nenhum pedido.</p>}
        {!ordersLoading && orders.length > 0 && (
          <ul>
            {orders.map((order) => (
              <li key={order.id} className="account-page__order">
                <div className="account-page__order-info">
                  <span>#{order.id.slice(0, 8)}</span>
                  <span>{new Date(order.created_at).toLocaleDateString('pt-BR')}</span>
                  <span>{formatBRL(order.total)}</span>
                  <span>{paymentMethodLabels[order.payment_method] ?? '—'}</span>
                  <span className={`order-status order-status--${order.status}`}>
                    {statusLabels[order.status] ?? order.status}
                  </span>
                </div>
                {order.status === 'pending' && order.checkout_url && (
                  <a className="btn btn--outline account-page__resume" href={order.checkout_url}>
                    Continuar pagamento
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <button type="button" className="btn btn--outline" onClick={handleSignOut}>
        Sair da conta
      </button>
    </div>
  )
}
