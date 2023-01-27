create table if not exists penalties(
  id bigserial primary key,
  name varchar(50) not null,
  begin_period_day integer not null,
  end_period_day integer not null,
  grace_period integer not null default 0,
  penalty_type varchar(50) not null,
  penalty numeric not null,
  accrual_account_id bigint not null
    constraint penalties_accrual_account_id_fkey
    references accounts,
  income_account_id bigint not null
    constraint penalties_income_account_id_fkey
    references accounts,
  write_off_account_id bigint not null
    constraint penalties_writeoff_account_id_fkey
    references accounts
);

