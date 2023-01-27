create table transaction_template (
  id     bigserial primary key,
  name   varchar(255) not null
);

create table transaction_template_accounts (
  id                  bigserial primary key,
  template_id         bigint not null,
  account_id          bigint not null,
  is_debit            boolean not null
);

alter table transaction_template_accounts
add constraint transaction_template_template_id_fkey
foreign key (template_id) references transaction_template(id);

alter table transaction_template_accounts
add constraint transaction_template_account_id_fkey
foreign key (account_id) references accounts(id);