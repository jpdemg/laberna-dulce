-- Etapa 11: cadastro passa a coletar telefone também (não só endereço).
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

  insert into public.profiles (id, name, first_name, last_name, phone, phone_country, address)
  values (
    new.id,
    full_name,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'phone',
    coalesce(new.raw_user_meta_data->>'phone_country', 'BR'),
    new.raw_user_meta_data->'address'
  )
  on conflict (id) do update set
    first_name = excluded.first_name,
    last_name = excluded.last_name,
    name = excluded.name,
    phone = coalesce(excluded.phone, public.profiles.phone),
    phone_country = coalesce(excluded.phone_country, public.profiles.phone_country),
    address = coalesce(excluded.address, public.profiles.address);

  return new;
end;
$$;
