import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { formatBRL } from '../lib/format'

const statusLabels = {
  pending: 'Aguardando pagamento',
  paid: 'Pagamento aprovado',
  cancelled: 'Cancelado',
}

export default function Account() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase
      .from('orders')
      .select('id, created_at, total, status')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setOrders(data ?? [])
        setLoading(false)
      })
  }, [user])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="account-page">
      <h1 className="reveal">minha conta</h1>
      <p className="account-page__email">{user?.email}</p>

      <section className="account-page__orders">
        <h2>Meus pedidos</h2>
        {loading && <p>Carregando pedidos...</p>}
        {!loading && orders.length === 0 && <p>Você ainda não fez nenhum pedido.</p>}
        {!loading && orders.length > 0 && (
          <ul>
            {orders.map((order) => (
              <li key={order.id} className="account-page__order">
                <span>#{order.id.slice(0, 8)}</span>
                <span>{new Date(order.created_at).toLocaleDateString('pt-BR')}</span>
                <span>{formatBRL(order.total)}</span>
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
