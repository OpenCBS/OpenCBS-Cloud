create table borrowing_products (
  id                bigserial primary key,
  name              varchar(200)   not null unique,
  code              varchar(32)    not null unique,
  currency_id       integer        not null,
  schedule_type     varchar(255)   not null,
  interest_rate_min decimal(8, 4)  not null,
  interest_rate_max decimal(8, 4)  not null,
  amount_min        decimal(16, 4) not null,
  amount_max        decimal(16, 4) not null,
  maturity_min      integer        not null,
  maturity_max      integer        not null,
  grace_period_min  integer        not null,
  grace_period_max  integer        not null
);

alter table borrowing_products
  add constraint borrowing_products_currency_id_fkey foreign key (currency_id) references currencies (id);