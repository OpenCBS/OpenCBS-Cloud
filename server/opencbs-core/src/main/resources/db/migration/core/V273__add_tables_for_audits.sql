create table if not exists user_sessions
(
  id              bigserial    not null
    constraint user_sessions_pkey
    primary key,
  user_id         bigint       not null
    constraint user_sessions_user_id_fkey
    references users,
  ip              varchar(255) not null,
  last_entry_time timestamp    not null
);

create schema if not exists audit;
create sequence if not exists hibernate_sequence;
create sequence if not exists audit.hibernate_sequence;

set search_path to audit;
create table audit.revinfo
(
  rev      serial
    constraint revinfo_pkey
    primary key,
  revtstmp bigint,
  username varchar(255)
);

create table audit.loan_products_history
(
  id                           bigint  not null,
  rev                          integer not null references revinfo,
  revtype                      smallint,
  availability                 integer,
  has_payees                   boolean,
  penalty_to_loan_amount       numeric(19, 2),
  penalty_to_olb               numeric(19, 2),
  penalty_to_overdue_interest  numeric(19, 2),
  penalty_to_overdue_principal numeric(19, 2),
  top_up_allow                 boolean,
  top_up_max_limit             numeric(19, 2),
  top_up_max_olb               numeric(19, 2),
  amount_max                   numeric(14, 2),
  amount_min                   numeric(14, 2),
  code                         varchar(255),
  grace_period_max             integer,
  grace_period_min             integer,
  interest_rate_max            numeric(8, 4),
  interest_rate_min            numeric(8, 4),
  maturity_max                 integer,
  maturity_min                 integer,
  name                         varchar(255),
  schedule_type                varchar(255),
  constraint loan_products_history_pkey
  primary key (id, rev)
);

create table audit.branches_history
(
  id          bigint  not null,
  rev         integer not null
    constraint fk6fo2q9iujv86dolxrg6nu78qw
    references revinfo,
  revtype     smallint,
  address     varchar(255),
  code        varchar(255),
  description varchar(255),
  name        varchar(255),
  constraint branches_history_pkey
  primary key (id, rev)
);

create table audit.loan_products_entry_fees_history
(
  rev             integer not null references revinfo,
  loan_product_id bigint  not null,
  entry_fee_id    bigint  not null,
  revtype         smallint,
  constraint loan_products_entry_fees_history_pkey
  primary key (rev, loan_product_id, entry_fee_id)
);

create table audit.users_history
(
  id             bigint  not null,
  rev            integer not null references revinfo,
  revtype        smallint,
  address        varchar(255),
  email          varchar(255),
  first_name     varchar(255),
  id_number      varchar(255),
  is_system_user boolean,
  last_name      varchar(255),
  password_hash  varchar(255),
  phone_number   varchar(255),
  position       varchar(255),
  time_zone_name varchar(255),
  username       varchar(255),
  branch_id      bigint,
  constraint users_history_pkey
  primary key (id, rev)
);

create table audit.roles_history
(
  id      bigint  not null,
  rev     integer not null references revinfo,
  revtype smallint,
  name    varchar(255),
  constraint roles_history_pkey
  primary key (id, rev)
);

create table audit.roles_permissions_history
(
  rev           integer not null references revinfo,
  role_id       bigint  not null,
  permission_id bigint  not null,
  revtype       smallint,
  constraint roles_permissions_history_pkey
  primary key (rev, role_id, permission_id)
);

create table audit.accounts_history
(
  id                         bigint  not null,
  rev                        integer not null references revinfo,
  revtype                    smallint,
  name                       varchar(255),
  allowed_cash_deposit       boolean,
  allowed_cash_withdrawal    boolean,
  allowed_manual_transaction boolean,
  allowed_transfer_from      boolean,
  allowed_transfer_to        boolean,
  close_date                 timestamp,
  is_debit                   boolean,
  lft                        integer,
  locked                     boolean,
  number                     varchar(255),
  rgt                        integer,
  start_date                 timestamp,
  type                       integer,
  validate_off               boolean,
  branch_id                  bigint,
  currency_id                bigint,
  parent_id                  bigint,
  constraint accounts_history_pkey
  primary key (id, rev)
);