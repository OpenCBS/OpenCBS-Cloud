create table loan_accounts (
  id          bigserial    primary key,
  type        varchar(255) not null,
  loan_id     integer      not null references loans (id),
  account_id  integer      not null references accounts (id)
);