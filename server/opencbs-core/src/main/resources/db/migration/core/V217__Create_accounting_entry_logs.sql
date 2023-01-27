create table accounting_entries_logs (
  id                  bigserial primary key,
  accounting_entry_id bigint    not null references accounting_entries(id),
  effective_date      TIMESTAMP not null,
  user_id             bigint    not null references users(id),
  handled             boolean   not null
);

alter table accounting_entries
drop column debit_account_balance,
drop column credit_account_balance;