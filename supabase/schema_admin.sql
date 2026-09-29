-- Etapa 8: catálogo dinâmico (admin), pedidos visíveis pro admin, agendamento de retirada/entrega.
-- Rode isso no SQL Editor do Supabase.

-- Catálogo: metadados que o painel de admin vai editar.
alter table products add column if not exists description text;
alter table products add column if not exists category text;
alter table products add column if not exists tag text;
alter table products add column if not exists images text[] not null default '{}';
alter table products add column if not exists best_seller boolean not null default false;

update products set category = 'bolos' where id like 'bolo-%' and category is null;
update products set category = 'sobremesas' where id like 'sobremesa-%' and category is null;
update products set category = 'docinhos' where id like 'docinho-%' and category is null;
update products set category = 'linha-to-go' where id like 'to-go-%' and category is null;
update products set best_seller = true where id like 'best-%';
update products set description = '[Descrição do produto: ingredientes, sabor e o que faz esse item especial. Substitua por um texto real.]'
  where description is null;

-- Quem é administrador.
alter table profiles add column if not exists is_admin boolean not null default false;

update profiles set is_admin = true
where id = (select id from auth.users where email = 'joaopedrogomes2007@gmail.com');

-- Admin pode gerenciar o catálogo (leitura pública já existia).
drop policy if exists "products_admin_write" on products;
create policy "products_admin_write" on products for all
  using (exists (select 1 from profiles where id = auth.uid() and is_admin))
  with check (exists (select 1 from profiles where id = auth.uid() and is_admin));

-- Admin vê e atualiza pedidos de todo mundo (cliente continua só vendo os próprios).
drop policy if exists "orders_admin_select_all" on orders;
create policy "orders_admin_select_all" on orders for select
  using (exists (select 1 from profiles where id = auth.uid() and is_admin));

drop policy if exists "orders_admin_update" on orders;
create policy "orders_admin_update" on orders for update
  using (exists (select 1 from profiles where id = auth.uid() and is_admin));

drop policy if exists "order_items_admin_select_all" on order_items;
create policy "order_items_admin_select_all" on order_items for select
  using (exists (select 1 from profiles where id = auth.uid() and is_admin));

-- Status de preparo (separado do status de pagamento) + agendamento de retirada/entrega.
alter table orders add column if not exists fulfillment_status text not null default 'preparing'
  check (fulfillment_status in ('preparing', 'ready', 'completed'));
alter table orders add column if not exists fulfillment_type text check (fulfillment_type in ('pickup', 'delivery'));
alter table orders add column if not exists scheduled_date date;
alter table orders add column if not exists scheduled_time text;
alter table orders add column if not exists customer_email text;

-- Bucket público de fotos dos produtos (upload só por admin, leitura livre).
insert into storage.buckets (id, name, public)
values ('product-photos', 'product-photos', true)
on conflict (id) do nothing;

drop policy if exists "product_photos_public_read" on storage.objects;
create policy "product_photos_public_read" on storage.objects for select
  using (bucket_id = 'product-photos');

drop policy if exists "product_photos_admin_insert" on storage.objects;
create policy "product_photos_admin_insert" on storage.objects for insert
  with check (bucket_id = 'product-photos' and exists (select 1 from profiles where id = auth.uid() and is_admin));

drop policy if exists "product_photos_admin_update" on storage.objects;
create policy "product_photos_admin_update" on storage.objects for update
  using (bucket_id = 'product-photos' and exists (select 1 from profiles where id = auth.uid() and is_admin));

drop policy if exists "product_photos_admin_delete" on storage.objects;
create policy "product_photos_admin_delete" on storage.objects for delete
  using (bucket_id = 'product-photos' and exists (select 1 from profiles where id = auth.uid() and is_admin));
