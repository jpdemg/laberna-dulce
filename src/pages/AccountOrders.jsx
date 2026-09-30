import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { formatBRL } from '../lib/format'
import { paymentMethodLabels } from '../lib/paymentMethods'

const statusLabels = {
  pending: 'Aguardando pagamento',
  paid: 'Pagamento aprovado',
  cancelled: 'Cancelado',
}

const fulfillmentTypeLabels = {
  pickup: 'Retirada no ateliê',
  delivery: 'Entrega',
}

const fulfillmentStatusLabels = {
  preparing: 'Em preparo',
  ready: 'Pronto',
  completed: 'Concluído',
}

export default function AccountOrders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState(null)
  const [error, setError] = useState('')

  const loadOrders = () => {
    if (!user) return
    supabase
      .from('orders')
      .select('id, created_at, total, status, payment_method, checkout_url, fulfillment_type, fulfillment_status, scheduled_date, scheduled_time')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setOrders(data ?? [])
        setLoading(false)
      })
  }

  useEffect(loadOrders, [user])

  const handleCancel = async (order) => {
    const message =
      order.status === 'paid'
        ? 'Cancelar este pedido vai reembolsar o pagamento. Deseja continuar?'
        : 'Tem certeza que deseja cancelar este pedido?'
    if (!window.confirm(message)) return

    setError('')
    setCancellingId(order.id)
    const { data, error: fnError } = await supabase.functions.invoke('cancel-order', {
      body: { orderId: order.id },
    })
    setCancellingId(null)

    if (fnError || data?.error) {
      setError('Não foi possível cancelar o pedido. Tente novamente ou fale com a gente.')
      return
    }

    setOrders((current) =>
      current.map((item) => (item.id === order.id ? { ...item, status: 'cancelled' } : item)),
    )
  }

  return (
    <section className="account-page__orders">
      {loading && <p>Carregando pedidos...</p>}
      {!loading && orders.length === 0 && <p>Você ainda não fez nenhum pedido.</p>}
      {error && <p className="auth-card__error">{error}</p>}
      {!loading && orders.length > 0 && (
        <ul>
          {orders.map((order) => (
            <li key={order.id} className="account-page__order">
              <div className="account-page__order-info">
                <span>#{order.id.slice(0, 8)}</span>
                <span>{new Date(order.created_at).toLocaleDateString('pt-BR')}</span>
                <span>{formatBRL(order.total)}</span>
                <span>{paymentMethodLabels[order.payment_method] ?? '—'}</span>
                <span key={order.status} className={`order-status order-status--${order.status}`}>
                  {statusLabels[order.status] ?? order.status}
                </span>
              </div>
              {order.fulfillment_type && (
                <p className="admin-orders__schedule">
                  {fulfillmentTypeLabels[order.fulfillment_type]}
                  {order.scheduled_date &&
                    ` em ${new Date(`${order.scheduled_date}T00:00:00`).toLocaleDateString('pt-BR')}`}
                  {order.scheduled_time && ` às ${order.scheduled_time}`}
                  {order.status === 'paid' && ` · ${fulfillmentStatusLabels[order.fulfillment_status]}`}
                </p>
              )}
              <div className="account-page__order-actions">
                {order.status === 'pending' && order.checkout_url && (
                  <a className="btn btn--outline account-page__resume" href={order.checkout_url}>
                    Continuar pagamento
                  </a>
                )}
                {(order.status === 'pending' || order.status === 'paid') && (
                  <button
                    type="button"
                    className="btn btn--outline account-page__cancel"
                    disabled={cancellingId === order.id}
                    onClick={() => handleCancel(order)}
                  >
                    {cancellingId === order.id ? 'Cancelando...' : 'Cancelar pedido'}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
