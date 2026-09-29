-- Etapa 5: guarda o tamanho e as observações escolhidos em cada item do pedido.
-- Rode isso no SQL Editor do Supabase.

alter table order_items add column if not exists size text;
alter table order_items add column if not exists notes text;
