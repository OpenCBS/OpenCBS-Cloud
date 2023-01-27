create table borrowings (
  id                           bigserial            primary key,
  code                         varchar(100)            not null,
  amount                       numeric(12, 2)          not null,
  interest_rate                numeric(8, 4)           not null,
  grace_period                 integer default 0       not null,
  maturity                     integer default 1       not null,
  disbursement_date            timestamp                   null,
  schedule_type                varchar(255)            not null,
  created_at                   timestamp default now() not null,
  created_by_id                integer default 1       not null,
  preferred_repayment_date     date                    not null,
  status                       varchar(100)            not null,
  loan_officer_id              integer                 not null,
  profile_id                   integer                 not null,

  foreign key (created_by_id)   references users(id),
  foreign key (loan_officer_id) references users(id),
  foreign key (profile_id) references profiles(id)
);