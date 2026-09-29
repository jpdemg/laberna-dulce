// @ts-nocheck
import Stripe from 'https://esm.sh/stripe@17?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')!
const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  httpClient: Stripe.createFetchHttpClient(),
})

Deno.serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  const body = await req.text()

  if (!signature) {
    return new Response('missing signature', { status: 400 })
  }

  let event
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, STRIPE_WEBHOOK_SECRET)
  } catch (error) {
    return new Response(`invalid signature: ${(error as Error).message}`, { status: 400 })
  }

  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  try {
    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      const session = event.data.object
      const orderId = session.metadata?.order_id
      if (orderId) {
        const paymentIntentId =
          typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id

        let paymentMethod: string | null = null
        if (paymentIntentId) {
          const intent = await stripe.paymentIntents.retrieve(paymentIntentId)
          paymentMethod = intent.payment_method_types?.[0] ?? null
        }

        const { data: order } = await admin
          .from('orders')
          .update({
            status: 'paid',
            stripe_payment_intent_id: paymentIntentId ?? null,
            payment_method: paymentMethod,
          })
          .eq('id', orderId)
          .select('user_id')
          .single()

        if (order && paymentMethod) {
          await admin.from('profiles').update({ last_payment_method: paymentMethod }).eq('id', order.user_id)
        }
      }
    }

    if (event.type === 'checkout.session.expired' || event.type === 'checkout.session.async_payment_failed') {
      const session = event.data.object
      const orderId = session.metadata?.order_id
      if (orderId) {
        await admin.from('orders').update({ status: 'cancelled' }).eq('id', orderId)
      }
    }
  } catch (error) {
    console.error(error)
  }

  return new Response('ok', { status: 200 })
})
