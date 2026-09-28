-- Esquema da Laberna Dulce: catálogo, pedidos e itens do pedido.
-- Rode este arquivo inteiro no Supabase (SQL Editor -> New query -> Run).
-- Os preços/nomes abaixo são os MESMOS placeholders de src/data/site.js.
-- Quando os produtos reais chegarem, atualize os dois lugares juntos.

create table if not exists products (
  id text primary key,
  name text not null,
  price numeric(10,2) not null,
  active boolean not null default true
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'paid', 'cancelled')),
  total numeric(10,2) not null,
  address jsonb,
  mp_preference_id text,
  mp_payment_id text,
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id text not null references products(id),
  quantity integer not null check (quantity > 0),
  unit_price numeric(10,2) not null
);

-- RLS: só leitura pública dos produtos; pedidos só visíveis pelo próprio dono.
-- Escrita em orders/order_items só pela Edge Function (service_role), nunca pelo cliente.

alter table products enable row level security;
create policy "products_select_all" on products for select using (true);

alter table orders enable row level security;
create policy "orders_select_own" on orders for select using (auth.uid() = user_id);

alter table order_items enable row level security;
create policy "order_items_select_own" on order_items for select using (
  exists (select 1 from orders o where o.id = order_items.order_id and o.user_id = auth.uid())
);

insert into products (id, name, price) values
  ('best-1', '[Produto 1]', 65),
  ('best-2', '[Produto 2]', 72),
  ('best-3', '[Produto 3]', 58),
  ('best-4', '[Produto 4]', 80),
  ('best-5', '[Produto 5]', 45),
  ('best-6', '[Produto 6]', 90),
  ('bolo-1', '[Bolo 1]', 40),
  ('bolo-2', '[Bolo 2]', 47),
  ('bolo-3', '[Bolo 3]', 54),
  ('bolo-4', '[Bolo 4]', 61),
  ('bolo-5', '[Bolo 5]', 68),
  ('bolo-6', '[Bolo 6]', 75),
  ('bolo-7', '[Bolo 7]', 82),
  ('bolo-8', '[Bolo 8]', 89),
  ('sobremesa-1', '[Sobremesa 1]', 40),
  ('sobremesa-2', '[Sobremesa 2]', 47),
  ('sobremesa-3', '[Sobremesa 3]', 54),
  ('sobremesa-4', '[Sobremesa 4]', 61),
  ('sobremesa-5', '[Sobremesa 5]', 68),
  ('sobremesa-6', '[Sobremesa 6]', 75),
  ('sobremesa-7', '[Sobremesa 7]', 82),
  ('sobremesa-8', '[Sobremesa 8]', 89),
  ('docinho-1', '[Docinho 1]', 40),
  ('docinho-2', '[Docinho 2]', 47),
  ('docinho-3', '[Docinho 3]', 54),
  ('docinho-4', '[Docinho 4]', 61),
  ('docinho-5', '[Docinho 5]', 68),
  ('docinho-6', '[Docinho 6]', 75),
  ('docinho-7', '[Docinho 7]', 82),
  ('docinho-8', '[Docinho 8]', 89),
  ('to-go-1', '[To Go 1]', 40),
  ('to-go-2', '[To Go 2]', 47),
  ('to-go-3', '[To Go 3]', 54),
  ('to-go-4', '[To Go 4]', 61),
  ('to-go-5', '[To Go 5]', 68),
  ('to-go-6', '[To Go 6]', 75),
  ('to-go-7', '[To Go 7]', 82),
  ('to-go-8', '[To Go 8]', 89)
on conflict (id) do update set name = excluded.name, price = excluded.price;
