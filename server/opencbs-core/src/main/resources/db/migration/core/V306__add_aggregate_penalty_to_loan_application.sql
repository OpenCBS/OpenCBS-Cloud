create table if not exists loan_application_penalties (
  id bigserial primary key not null,
  loan_application_id bigint not null references loan_applications(id),
  begin_period_day integer not null,
  end_period_day integer not null,
  grace_period integer not null default 0,
  penalty_type varchar(50) not null,
  penalty numeric not null,
  accrual_account_id bigint not null
    constraint loan_application_accrual_account_id_fkey
    references accounts,
  income_account_id bigint not null
    constraint loan_application_income_account_id_fkey
    references accounts,
  write_off_account_id bigint not null
    constraint loan_application_write_off_account_id_fkey
    references accounts
);

create table if not exists loan_penalty_accounts (
  id bigserial primary key not null,
  loan_id bigint not null references loans(id),
  loan_application_penalty_id bigint not null references loan_application_penalties(id),
  accrual_account_id bigint not null
    constraint loan_penalty_accrual_account_id_fkey
    references accounts(id),
  income_account_id bigint not null
    constraint loan_penalty_income_account_id_fkey
    references accounts(id),
  write_off_account_id bigint not null
    constraint loan_penalty_write_off_account_id_fkey
    references accounts(id)
);

