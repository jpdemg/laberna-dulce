import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { formatBRL } from '../lib/format'

const statusCopy = {
  pending: {
    title: 'Confirmando seu pagamento...',
    text: 'Isso costuma levar só alguns segundos. Não feche esta página.',
  },
  paid: {
    title: 'Pagamento aprovado!',
    text: 'Recebemos seu pedido e já vamos começar a preparar tudo com carinho.',
  },
  cancelled: {
    title: 'Pagamento não aprovado',
    text: 'Algo deu errado com o pagamento. Você pode tentar novamente pelo carrinho.',
  },
}

export default function OrderStatus() {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('order')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) {
      setLoading(false)
      return
    }

    let attempts = 0
    let cancelled = false

    const fetchOrder = async () => {
      const { data } = await supabase
        .from('orders')
        .select('id, status, total')
        .eq('id', orderId)
        .single()

      if (cancelled) return
      setOrder(data)
      setLoading(false)

      attempts += 1
      if (data?.status === 'pending' && attempts < 10) {
        setTimeout(fetchOrder, 3000)
      }
    }

    fetchOrder()
    return () => {
      cancelled = true
    }
  }, [orderId])

  if (!orderId) {
    return (
      <div className="order-status-page">
        <h1>Pedido não encontrado</h1>
        <Link className="btn btn--primary" to="/">
          Voltar para a página inicial
        </Link>
      </div>
    )
  }

  const status = order?.status ?? 'pending'
  const copy = statusCopy[status] ?? statusCopy.pending

  return (
    <div className="order-status-page">
      <h1 className="reveal">{loading ? 'Carregando pedido...' : copy.title}</h1>
      {!loading && (
        <>
          <p>{copy.text}</p>
          {order && <p className="order-status-page__total">Total: {formatBRL(order.total)}</p>}
        </>
      )}
      <Link className="btn btn--primary" to="/conta">
        Ver meus pedidos
      </Link>
    </div>
  )
}
