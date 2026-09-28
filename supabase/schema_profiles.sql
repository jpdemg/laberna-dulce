-- Etapa 2: perfil do cliente (nome, telefone, endereço salvo, último método de pagamento).
-- Rode isso no SQL Editor do Supabase (pode rodar junto com o schema.sql antigo sem problema, é idempotente).

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  phone text,
  address jsonb,
  last_payment_method text,
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;

drop policy if exists "profiles_select_own" on profiles;
create policy "profiles_select_own" on profiles for select using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on profiles;
create policy "profiles_insert_own" on profiles for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on profiles;
create policy "profiles_update_own" on profiles for update using (auth.uid() = id);

-- Cria automaticamente uma linha de perfil quando o usuário se cadastra,
-- já aproveitando o nome informado no formulário de cadastro.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Guarda o método de pagamento usado em cada pedido (Pix, cartão, boleto...).
alter table orders add column if not exists payment_method text;

-- Cria retroativamente o perfil de quem já tinha se cadastrado antes desta migração.
insert into public.profiles (id, name)
select id, raw_user_meta_data->>'name' from auth.users
on conflict (id) do nothing;
