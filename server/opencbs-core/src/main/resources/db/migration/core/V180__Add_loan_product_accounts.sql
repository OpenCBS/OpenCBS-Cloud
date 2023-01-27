create table loan_products_accounts (
  id              bigserial    primary key,
  type            varchar(255) not null,
  loan_product_id integer      not null references loan_products(id),
  account_id      integer      not null references accounts(id)
);