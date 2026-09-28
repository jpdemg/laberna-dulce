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

export default function AccountOrders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase
      .from('orders')
      .select('id, created_at, total, status, payment_method, checkout_url')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setOrders(data ?? [])
        setLoading(false)
      })
  }, [user])

  return (
    <section className="account-page__orders">
      {loading && <p>Carregando pedidos...</p>}
      {!loading && orders.length === 0 && <p>Você ainda não fez nenhum pedido.</p>}
      {!loading && orders.length > 0 && (
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
  )
}
