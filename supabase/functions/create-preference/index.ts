import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const MP_ACCESS_TOKEN = Deno.env.get('MP_ACCESS_TOKEN')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const SITE_URL = Deno.env.get('SITE_URL') ?? 'https://jpdemg.github.io/laberna-dulce'

// Precisa ser exatamente igual a `defaultSizes` em src/data/site.js.
// O multiplicador nunca vem do cliente, só o rótulo do tamanho escolhido.
const SIZE_MULTIPLIERS: Record<string, number> = { P: 0.8, M: 1, G: 1.3 }

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

    const { items, address } = await req.json()

    if (!Array.isArray(items) || items.length === 0) {
      return json({ error: 'Carrinho vazio' }, 400)
    }

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    const ids = items.map((item: { id: string }) => item.id)
    const { data: products, error: productsError } = await admin
      .from('products')
      .select('id, name, price')
      .in('id', ids)
      .eq('active', true)

    if (productsError || !products || products.length === 0) {
      return json({ error: 'Produtos inválidos' }, 400)
    }

    const productMap = new Map(products.map((product) => [product.id, product]))

    const orderItems = items.map((item: { id: string; quantity: number; size?: string; notes?: string }) => {
      const product = productMap.get(item.id)
      if (!product) throw new Error(`Produto ${item.id} não encontrado`)
      const multiplier = SIZE_MULTIPLIERS[item.size ?? 'M'] ?? 1
      return {
        product_id: product.id,
        name: product.name,
        quantity: Math.max(1, Math.floor(item.quantity)),
        unit_price: Number(product.price) * multiplier,
        size: item.size ?? 'M',
        notes: item.notes ?? '',
      }
    })

    const total = orderItems.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)

    const { data: order, error: orderError } = await admin
      .from('orders')
      .insert({ user_id: userData.user.id, status: 'pending', total, address })
      .select()
      .single()

    if (orderError || !order) {
      return json({ error: 'Não foi possível criar o pedido' }, 500)
    }

    await admin.from('order_items').insert(
      orderItems.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        size: item.size,
        notes: item.notes,
      })),
    )

    const preferenceResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: orderItems.map((item) => ({
          title: `${item.name} (Tamanho ${item.size})`,
          quantity: item.quantity,
          unit_price: item.unit_price,
          currency_id: 'BRL',
        })),
        payer: { email: userData.user.email },
        external_reference: order.id,
        back_urls: {
          success: `${SITE_URL}/pedido-confirmado?order=${order.id}`,
          pending: `${SITE_URL}/pedido-confirmado?order=${order.id}`,
          failure: `${SITE_URL}/pedido-confirmado?order=${order.id}`,
        },
        auto_return: 'approved',
        notification_url: `${SUPABASE_URL}/functions/v1/mercadopago-webhook`,
      }),
    })

    const preference = await preferenceResponse.json()

    if (!preferenceResponse.ok) {
      return json({ error: 'Erro ao criar preferência de pagamento', details: preference }, 502)
    }

    const useSandbox = Deno.env.get('MP_USE_SANDBOX') === 'true'
    const checkoutUrl = useSandbox ? preference.sandbox_init_point : preference.init_point

    await admin
      .from('orders')
      .update({ mp_preference_id: preference.id, checkout_url: checkoutUrl })
      .eq('id', order.id)

    return json({ init_point: checkoutUrl, order_id: order.id })
  } catch (error) {
    return json({ error: (error as Error).message }, 500)
  }
})
