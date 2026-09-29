import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { formatBRL } from '../lib/format'
import { paymentMethodLabels } from '../lib/paymentMethods'

const statusLabels = {
  pending: 'Aguardando pagamento',
  paid: 'Pagamento aprovado',
  cancelled: 'Cancelado',
}

const fulfillmentLabels = {
  preparing: 'Em preparo',
  ready: 'Pronto',
  completed: 'Concluído',
}

const fulfillmentTypeLabels = {
  pickup: 'Retirada',
  delivery: 'Entrega',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const loadOrders = () => {
    supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setOrders(data ?? [])
        setLoading(false)
      })
  }

  useEffect(loadOrders, [])

  const updateFulfillment = async (order, fulfillment_status) => {
    await supabase.from('orders').update({ fulfillment_status }).eq('id', order.id)
    setOrders((current) =>
      current.map((item) => (item.id === order.id ? { ...item, fulfillment_status } : item)),
    )
  }

  if (loading) return <p>Carregando pedidos...</p>
  if (orders.length === 0) return <p>Nenhum pedido ainda.</p>

  return (
    <ul className="admin-orders">
      {orders.map((order) => (
        <li key={order.id} className="admin-orders__row">
          <div className="admin-orders__info">
            <span>#{order.id.slice(0, 8)}</span>
            <span>{order.customer_email ?? '—'}</span>
            <span>{new Date(order.created_at).toLocaleDateString('pt-BR')}</span>
            <span>{formatBRL(order.total)}</span>
            <span>{paymentMethodLabels[order.payment_method] ?? '—'}</span>
            <span className={`order-status order-status--${order.status}`}>
              {statusLabels[order.status] ?? order.status}
            </span>
          </div>

          {order.fulfillment_type && (
            <p className="admin-orders__schedule">
              {fulfillmentTypeLabels[order.fulfillment_type]}
              {order.scheduled_date &&
                ` em ${new Date(`${order.scheduled_date}T00:00:00`).toLocaleDateString('pt-BR')}`}
              {order.scheduled_time && ` às ${order.scheduled_time}`}
            </p>
          )}

          {order.address && (
            <p className="admin-orders__address">
              {order.address.street}, {order.address.number} — {order.address.neighborhood},{' '}
              {order.address.city}/{order.address.state} · Tel: {order.address.phone}
            </p>
          )}

          {order.status === 'paid' && (
            <div className="admin-orders__fulfillment">
              <label>
                Status de preparo
                <select
                  value={order.fulfillment_status}
                  onChange={(e) => updateFulfillment(order, e.target.value)}
                >
                  <option value="preparing">{fulfillmentLabels.preparing}</option>
                  <option value="ready">{fulfillmentLabels.ready}</option>
                  <option value="completed">{fulfillmentLabels.completed}</option>
                </select>
              </label>
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}
