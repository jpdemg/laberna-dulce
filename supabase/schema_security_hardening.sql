-- Etapa 9: bloqueia auto-promoção a admin.
-- Rode isso no SQL Editor do Supabase.
--
-- Hoje, "profiles_update_own"/"profiles_insert_own" permitem que o próprio
-- usuário altere QUALQUER coluna da sua linha em profiles, inclusive is_admin.
-- Isso significa que qualquer cliente logado poderia se autopromover a admin
-- chamando supabase.from('profiles').update({ is_admin: true }) direto do
-- navegador. A revogação abaixo bloqueia isso a nível de coluna, antes até
-- de qualquer política de RLS ser avaliada.

revoke update (is_admin), insert (is_admin) on public.profiles from authenticated, anon;
