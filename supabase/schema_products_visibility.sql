-- Etapa 10: esconde produtos inativos/rascunho de quem não é admin.
-- Rode isso no SQL Editor do Supabase.
--
-- Hoje "products_select_all" libera leitura de TODA a tabela (using (true)),
-- inclusive produtos com active=false. O app filtra active=true na tela,
-- mas qualquer pessoa pode consultar a API do Supabase direto e ver
-- produto ainda não publicado (foto, preço, descrição). Isso restringe
-- a leitura pública a produtos ativos, mantendo acesso total pro admin.

drop policy if exists "products_select_all" on products;
create policy "products_select_all" on products for select
  using (
    active = true
    or exists (select 1 from profiles where id = auth.uid() and is_admin)
  );
