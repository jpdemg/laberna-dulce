-- Etapa 4: guarda o link de checkout do pedido, para o cliente poder retomar
-- um pagamento pendente sem precisar montar o carrinho de novo.

alter table orders add column if not exists checkout_url text;
