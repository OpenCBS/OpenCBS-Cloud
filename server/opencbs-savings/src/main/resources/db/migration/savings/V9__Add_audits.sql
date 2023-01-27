set search_path to audit;

create table audit.saving_product_accounts_history
(
  id                bigint  not null,
  rev               integer not null references revinfo,
  revtype           smallint,
  saving_product_id bigint,
  constraint saving_product_accounts_history_pkey
  primary key (id, rev)
);

create table audit.saving_products_history
(
  id                         bigint  not null,
  rev                        integer not null references revinfo,
  revtype                    smallint,
  availability               integer,
  capitalized                boolean,
  close_fee_flat_max         numeric(14, 2),
  close_fee_flat_min         numeric(14, 2),
  close_fee_rate_max         numeric(14, 2),
  close_fee_rate_min         numeric(14, 2),
  code                       varchar(255),
  deposit_amount_max         numeric(14, 2),
  deposit_amount_min         numeric(14, 2),
  deposit_fee_flat_max       numeric(14, 2),
  deposit_fee_flat_min       numeric(14, 2),
  deposit_fee_rate_max       numeric(14, 2),
  deposit_fee_rate_min       numeric(14, 2),
  entry_fee_flat_max         numeric(14, 2),
  entry_fee_flat_min         numeric(14, 2),
  entry_fee_rate_max         numeric(14, 2),
  entry_fee_rate_min         numeric(14, 2),
  initial_amount_max         numeric(14, 2),
  initial_amount_min         numeric(14, 2),
  interest_accrual_frequency varchar(255),
  interest_rate_max          numeric(8, 4),
  interest_rate_min          numeric(8, 4),
  management_fee_flat_max    numeric(14, 2),
  management_fee_flat_min    numeric(14, 2),
  management_fee_frequency varchar(255),
  management_fee_rate_max  numeric(14, 2),
  management_fee_rate_min  numeric(14, 2),
  min_balance              numeric(19, 2),
  posting_frequency        varchar(255),
  withdrawal_amount_max    numeric(14, 2),
  withdrawal_amount_min    numeric(14, 2),
  withdrawal_fee_flat_max  numeric(14, 2),
  withdrawal_fee_flat_min  numeric(14, 2),
  withdrawal_fee_rate_max  numeric(14, 2),
  withdrawal_fee_rate_min  numeric(14, 2),
  currency_id              bigint,
  name                     varchar(255),
  constraint saving_products_history_pkey
  primary key (id, rev)
);