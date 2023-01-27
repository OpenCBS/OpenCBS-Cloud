create table bonds_product (
  id                 bigserial      primary key,
  name               varchar(200)   not null unique,
  code               varchar(32)    not null unique,
  amount             decimal(16, 4) not null unique,
  number_min         decimal(16, 4) not null,
  number_max         decimal(16, 4) not null,
  interest_rate_min  decimal(8, 4)  not null,
  interest_rate_max  decimal(8, 4)  not null,
  coupon_frequency   varchar(32)    not null,
  maturity_min       integer        not null,
  maturity_max       integer        not null,
  interest_scheme    varchar(200)   not null,
  currency_id        bigint         not null references currencies (id)
);

create table bonds_product_accounts (
  id                bigserial   primary key,
  type              varchar(50) not null,
  bonds_product_id  bigint     not null references bonds_product (id),
  account_id        bigint     not null references accounts (id)
);

insert into bonds_product
(name, code, amount, number_min, number_max, interest_rate_min, interest_rate_max, maturity_min, maturity_max
  , coupon_frequency, interest_scheme, currency_id)
values
  ('Bond Product', 'BP', 125000, 1, 1000, 1, 100, 1, 100, 'QUARTERLY', 'BALOON'
    ,(select cast(value as bigint) from global_settings where name = 'PIVOT_CURRENCY_ID'));

