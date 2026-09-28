-- Etapa 3: nome e sobrenome separados, país do telefone.
-- Rode isso no SQL Editor do Supabase.

alter table profiles add column if not exists first_name text;
alter table profiles add column if not exists last_name text;
alter table profiles add column if not exists phone_country text default 'BR';

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  full_name text;
begin
  full_name := trim(
    coalesce(new.raw_user_meta_data->>'first_name', '') || ' ' ||
    coalesce(new.raw_user_meta_data->>'last_name', '')
  );

  insert into public.profiles (id, name, first_name, last_name)
  values (
    new.id,
    full_name,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name'
  )
  on conflict (id) do update set
    first_name = excluded.first_name,
    last_name = excluded.last_name,
    name = excluded.name;

  return new;
end;
$$;
