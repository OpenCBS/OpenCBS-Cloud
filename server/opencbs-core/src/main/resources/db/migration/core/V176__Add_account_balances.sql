create table account_balances (
  id         bigserial primary key,
  account_id int                         not null,
  balance    decimal(14, 2)              not null,
  date       timestamp without time zone not null,
  is_last    boolean default true        not null,
  unique(account_id, date)
);

alter table account_balances
  add constraint account_balances_account_id_fkey foreign key (account_id) references accounts (id);