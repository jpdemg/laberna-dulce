// @ts-nocheck
import Stripe from 'https://esm.sh/stripe@17?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  httpClient: Stripe.createFetchHttpClient(),
})

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
      .select('id, user_id, status, stripe_payment_intent_id')
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
      if (!order.stripe_payment_intent_id) {
        return json({ error: 'Pedido pago sem referência de pagamento, contate o suporte' }, 409)
      }

      try {
        await stripe.refunds.create({ payment_intent: order.stripe_payment_intent_id })
      } catch (error) {
        return json({ error: 'Não foi possível processar o reembolso', details: (error as Error).message }, 502)
      }
    }

    await admin.from('orders').update({ status: 'cancelled' }).eq('id', orderId)

    return json({ status: 'cancelled' })
  } catch (error) {
    return json({ error: (error as Error).message }, 500)
  }
})
