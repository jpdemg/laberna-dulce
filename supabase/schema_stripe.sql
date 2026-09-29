-- Etapa 7: troca de Mercado Pago para Stripe.
-- Rode isso no SQL Editor do Supabase.

alter table orders add column if not exists stripe_session_id text;
alter table orders add column if not exists stripe_payment_intent_id text;
