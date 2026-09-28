import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const MP_ACCESS_TOKEN = Deno.env.get('MP_ACCESS_TOKEN')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url)
    const topic = url.searchParams.get('topic') ?? url.searchParams.get('type')
    let paymentId = url.searchParams.get('id') ?? url.searchParams.get('data.id')

    if (req.method === 'POST') {
      const body = await req.json().catch(() => null)
      paymentId = body?.data?.id ?? paymentId
    }

    if (!paymentId || (topic && topic !== 'payment')) {
      return new Response('ok', { status: 200 })
    }

    const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` },
    })
    const payment = await paymentResponse.json()

    const orderId = payment.external_reference
    if (!orderId) {
      return new Response('ok', { status: 200 })
    }

    const status =
      payment.status === 'approved' ? 'paid' : payment.status === 'rejected' ? 'cancelled' : 'pending'
    const paymentMethod = payment.payment_type_id ?? null

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    const { data: order } = await admin
      .from('orders')
      .update({ status, mp_payment_id: String(payment.id), payment_method: paymentMethod })
      .eq('id', orderId)
      .select('user_id')
      .single()

    if (order && paymentMethod) {
      await admin
        .from('profiles')
        .update({ last_payment_method: paymentMethod })
        .eq('id', order.user_id)
    }

    return new Response('ok', { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response('ok', { status: 200 })
  }
})
