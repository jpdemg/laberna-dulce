import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { formatBRL } from '../lib/format'

export default function AdminMetrics() {
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState({
    revenueThisMonth: 0,
    paidOrdersThisMonth: 0,
    pendingOrders: 0,
    topProducts: [],
  })

  useEffect(() => {
    const load = async () => {
      setLoading(true)

      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const [ordersRes, itemsRes] = await Promise.all([
        supabase.from('orders').select('status, total, created_at'),
        supabase.from('order_items').select('quantity, product_id, products(name)'),
      ])

      const orders = ordersRes.data ?? []
      const items = itemsRes.data ?? []

      const paidThisMonth = orders.filter(
        (order) => order.status === 'paid' && new Date(order.created_at) >= startOfMonth,
      )
      const revenueThisMonth = paidThisMonth.reduce((sum, order) => sum + Number(order.total), 0)
      const pendingOrders = orders.filter((order) => order.status === 'pending').length

      const countByProduct = new Map()
      items.forEach((item) => {
        const key = item.product_id
        const current = countByProduct.get(key) ?? { name: item.products?.name ?? key, quantity: 0 }
        current.quantity += item.quantity
        countByProduct.set(key, current)
      })
      const topProducts = [...countByProduct.values()].sort((a, b) => b.quantity - a.quantity).slice(0, 5)

      setMetrics({ revenueThisMonth, paidOrdersThisMonth: paidThisMonth.length, pendingOrders, topProducts })
      setLoading(false)
    }

    load()
  }, [])

  if (loading) return <p>Carregando...</p>

  return (
    <section className="admin-metrics">
      <div className="admin-metrics__grid">
        <div className="admin-metrics__card">
          <span className="admin-metrics__label">Faturamento do mês</span>
          <strong className="admin-metrics__value">{formatBRL(metrics.revenueThisMonth)}</strong>
        </div>
        <div className="admin-metrics__card">
          <span className="admin-metrics__label">Pedidos pagos no mês</span>
          <strong className="admin-metrics__value">{metrics.paidOrdersThisMonth}</strong>
        </div>
        <div className="admin-metrics__card">
          <span className="admin-metrics__label">Pedidos aguardando pagamento</span>
          <strong className="admin-metrics__value">{metrics.pendingOrders}</strong>
        </div>
      </div>

      <h2>Produtos mais vendidos</h2>
      {metrics.topProducts.length === 0 ? (
        <p>Ainda não há vendas registradas.</p>
      ) : (
        <ol className="admin-metrics__top-products">
          {metrics.topProducts.map((product) => (
            <li key={product.name}>
              <span>{product.name}</span>
              <span>{product.quantity} vendidos</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
