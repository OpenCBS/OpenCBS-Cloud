create table borrowing_products_accounts (
  id                        bigserial    primary key,
  type                      varchar(255) not null,
  borrowing_product_id      integer      not null references borrowing_products (id),
  account_id                integer      not null references accounts (id)
);