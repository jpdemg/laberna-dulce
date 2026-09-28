import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { formatBRL } from '../lib/format'

const emptyAddress = {
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: 'São Paulo',
  state: 'SP',
  zip: '',
  phone: '',
}

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [address, setAddress] = useState(emptyAddress)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const updateField = (field) => (event) =>
    setAddress((current) => ({ ...current, [field]: event.target.value }))

  const handlePay = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    const { data, error: fnError } = await supabase.functions.invoke('create-preference', {
      body: {
        items: items.map((item) => ({ id: item.id, quantity: item.quantity })),
        address,
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
            Rua
            <input required value={address.street} onChange={updateField('street')} />
          </label>
          <div className="checkout-form__row">
            <label>
              Número
              <input required value={address.number} onChange={updateField('number')} />
            </label>
            <label>
              Complemento
              <input value={address.complement} onChange={updateField('complement')} />
            </label>
          </div>
          <label>
            Bairro
            <input required value={address.neighborhood} onChange={updateField('neighborhood')} />
          </label>
          <div className="checkout-form__row">
            <label>
              Cidade
              <input required value={address.city} onChange={updateField('city')} />
            </label>
            <label>
              Estado
              <input required value={address.state} onChange={updateField('state')} maxLength={2} />
            </label>
            <label>
              CEP
              <input required value={address.zip} onChange={updateField('zip')} />
            </label>
          </div>
          <label>
            Telefone
            <input required value={address.phone} onChange={updateField('phone')} />
          </label>
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
