create table if not exists analytics_active_loans
(
  id                          bigserial not null
    constraint analytics_active_loans_pkey
    primary key,
  loan_id                     bigint,
  calculated_date             date,
  disbursement_date           date,
  planned_close_date          date,
  close_date                  timestamp,
  profile_id                  integer,
  profile_name                varchar(255),
  profile_type                varchar(20),
  loan_product_id             integer,
  loan_product_name           varchar(200),
  loan_products_currency_id   integer,
  loan_products_currency_name varchar(200),
  loan_purpose_id             integer,
  loan_purpose_name           varchar(200),
  loan_officer_id             integer,
  loan_officer_name           varchar(200),
  branch_id                   bigint,
  branch_name                 varchar(255),
  branch_code                 varchar(15),
  address                     text,
  interest_rate               numeric(8, 4),
  interest                    numeric(12, 2),
  principal                   numeric(12, 2),
  olb                         numeric(12, 2),
  late_principal              numeric(12, 2),
  late_interest               numeric(12, 2),
  interest_due                numeric(12, 2),
  penalty_due                 numeric(12, 2),
  late_days                   integer,
  constraint production
  unique (loan_id, calculated_date)
);
