create table loan_products (
  id bigserial primary key,
  name varchar(200) not null unique,
  currency_id integer not null,
  schedule_type varchar(255) not null,
  interest_rate_min decimal(8, 4) not null,
  interest_rate_max decimal(8, 4) not null,
  amount_min decimal(16, 4) not null,
  amount_max decimal(16, 4) not null,
  maturity_min integer not null,
  maturity_max integer not null,
  grace_period_min integer not null,
  grace_period_max integer not null,
  penalty_type varchar(255) not null
);

create table availabilities (
  availability_id integer not null,
  availability varchar(250) not null
);

alter table availabilities
    add constraint availabilities_availability_id_fkey foreign key(availability_id) references loan_products (id) match full;