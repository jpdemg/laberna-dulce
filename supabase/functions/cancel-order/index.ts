import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const MP_ACCESS_TOKEN = Deno.env.get('MP_ACCESS_TOKEN')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization') ?? ''
    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    })
    const { data: userData, error: userError } = await userClient.auth.getUser()

    if (userError || !userData.user) {
      return json({ error: 'Não autenticado' }, 401)
    }

    const { orderId } = await req.json()
    if (!orderId) {
      return json({ error: 'Pedido inválido' }, 400)
    }

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    const { data: order, error: orderError } = await admin
      .from('orders')
      .select('id, user_id, status, mp_payment_id')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return json({ error: 'Pedido não encontrado' }, 404)
    }

    if (order.user_id !== userData.user.id) {
      return json({ error: 'Você não tem permissão para cancelar este pedido' }, 403)
    }

    if (order.status === 'cancelled') {
      return json({ status: 'cancelled' })
    }

    if (order.status === 'paid') {
      if (!order.mp_payment_id) {
        return json({ error: 'Pedido pago sem referência de pagamento, contate o suporte' }, 409)
      }

      const refundResponse = await fetch(
        `https://api.mercadopago.com/v1/payments/${order.mp_payment_id}/refunds`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
        },
      )

      if (!refundResponse.ok) {
        const details = await refundResponse.json().catch(() => null)
        return json({ error: 'Não foi possível processar o reembolso', details }, 502)
      }
    }

    await admin.from('orders').update({ status: 'cancelled' }).eq('id', orderId)

    return json({ status: 'cancelled' })
  } catch (error) {
    return json({ error: (error as Error).message }, 500)
  }
})
