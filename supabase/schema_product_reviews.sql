-- Etapa 12: avaliações de produto (estrelas + comentário).
-- Rode isso no SQL Editor do Supabase.

create table if not exists product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references products(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  reviewer_name text not null,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (product_id, user_id)
);

alter table product_reviews enable row level security;

-- Leitura pública (qualquer visitante vê as avaliações).
drop policy if exists "product_reviews_select_all" on product_reviews;
create policy "product_reviews_select_all" on product_reviews for select using (true);

-- Cada cliente só cria/edita/exclui a própria avaliação (1 por produto, por causa do unique acima).
drop policy if exists "product_reviews_insert_own" on product_reviews;
create policy "product_reviews_insert_own" on product_reviews for insert
  with check (auth.uid() = user_id);

drop policy if exists "product_reviews_update_own" on product_reviews;
create policy "product_reviews_update_own" on product_reviews for update
  using (auth.uid() = user_id);

drop policy if exists "product_reviews_delete_own" on product_reviews;
create policy "product_reviews_delete_own" on product_reviews for delete
  using (auth.uid() = user_id);

-- Admin pode remover avaliação de qualquer pessoa (moderação).
drop policy if exists "product_reviews_admin_delete" on product_reviews;
create policy "product_reviews_admin_delete" on product_reviews for delete
  using (exists (select 1 from profiles where id = auth.uid() and is_admin));
