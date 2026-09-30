-- Etapa 13: lista de favoritos do cliente.
-- Rode isso no SQL Editor do Supabase.

create table if not exists favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id text not null references products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

alter table favorites enable row level security;

drop policy if exists "favorites_select_own" on favorites;
create policy "favorites_select_own" on favorites for select using (auth.uid() = user_id);

drop policy if exists "favorites_insert_own" on favorites;
create policy "favorites_insert_own" on favorites for insert with check (auth.uid() = user_id);

drop policy if exists "favorites_delete_own" on favorites;
create policy "favorites_delete_own" on favorites for delete using (auth.uid() = user_id);
