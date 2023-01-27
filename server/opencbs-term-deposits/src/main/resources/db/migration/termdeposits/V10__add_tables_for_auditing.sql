create table if not exists audit.term_deposit_products_history
(
  id bigint not null,
  rev integer not null,
  revtype smallint,
  amount_max numeric(19,2),
  amount_min numeric(19,2),
  availability integer,
  code varchar(32),
  early_close_fee_flat_max numeric(19,2),
  early_close_fee_flat_min numeric(19,2),
  early_close_fee_rate_max numeric(19,2),
  early_close_fee_rate_min numeric(19,2),
  interest_accrual_frequency varchar(255),
  interest_rate_max numeric(19,2),
  interest_rate_min numeric(19,2),
  name varchar(200),
  term_agreement_max numeric(19,2),
  term_agreement_min numeric(19,2),
  currency_id bigint,
  status varchar(10),
  constraint term_deposit_products_history_pkey
  primary key (id, rev)
);