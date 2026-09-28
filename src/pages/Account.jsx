import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useProfile } from '../hooks/useProfile'
import { supabase } from '../lib/supabaseClient'
import { formatBRL } from '../lib/format'

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

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState(emptyAddress)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!profile) return
    setName(profile.name ?? '')
    setPhone(profile.phone ?? '')
    setAddress({ ...emptyAddress, ...(profile.address ?? {}) })
  }, [profile])

  useEffect(() => {
    if (!user) return
    supabase
      .from('orders')
      .select('id, created_at, total, status, payment_method')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setOrders(data ?? [])
        setOrdersLoading(false)
      })
  }, [user])

  const updateAddressField = (field) => (event) =>
    setAddress((current) => ({ ...current, [field]: event.target.value }))

  const handleSaveProfile = async (event) => {
    event.preventDefault()
    setSaving(true)
    setSaved(false)
    await saveProfile({ name, phone, address })
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
            <label>
              Nome
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label>
              Telefone
              <input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </label>
          </fieldset>

          <fieldset>
            <legend>Endereço de entrega salvo</legend>
            <label>
              CEP
              <input value={address.zip} onChange={updateAddressField('zip')} />
            </label>
            <label>
              Rua
              <input value={address.street} onChange={updateAddressField('street')} />
            </label>
            <div className="checkout-form__row">
              <label>
                Número
                <input value={address.number} onChange={updateAddressField('number')} />
              </label>
              <label>
                Complemento
                <input value={address.complement} onChange={updateAddressField('complement')} />
              </label>
            </div>
            <label>
              Bairro
              <input value={address.neighborhood} onChange={updateAddressField('neighborhood')} />
            </label>
            <div className="checkout-form__row">
              <label>
                Cidade
                <input value={address.city} onChange={updateAddressField('city')} />
              </label>
              <label>
                Estado
                <input value={address.state} onChange={updateAddressField('state')} maxLength={2} />
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
                <span>#{order.id.slice(0, 8)}</span>
                <span>{new Date(order.created_at).toLocaleDateString('pt-BR')}</span>
                <span>{formatBRL(order.total)}</span>
                <span>{paymentMethodLabels[order.payment_method] ?? '—'}</span>
                <span className={`order-status order-status--${order.status}`}>
                  {statusLabels[order.status] ?? order.status}
                </span>
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
