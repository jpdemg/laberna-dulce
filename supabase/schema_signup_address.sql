-- Etapa 6: salva o endereço já no cadastro (metadata do signUp -> profiles.address).
-- Rode isso no SQL Editor do Supabase.

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

  insert into public.profiles (id, name, first_name, last_name, address)
  values (
    new.id,
    full_name,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->'address'
  )
  on conflict (id) do update set
    first_name = excluded.first_name,
    last_name = excluded.last_name,
    name = excluded.name,
    address = coalesce(excluded.address, public.profiles.address);

  return new;
end;
$$;
