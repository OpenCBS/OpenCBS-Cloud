create table bonds_installments (
  id                           bigserial             primary key,
  bonds_id                     bigint                   not null,
  number                       integer                  not null,
  maturity_date                date                     not null,
  interest                     numeric(12, 2)           not null,
  principal                    numeric(12, 2)           not null,
  paid_principal               numeric(12, 2) default 0 not null,
  paid_interest                numeric(12, 2) default 0 not null,
  olb                          numeric(12, 2)           not null,
  last_accrual_date            date                     not null,
  event_group_key              bigint                   null,
  effective_at                 timestamp                not null,
  deleted                      boolean,
  rescheduled                  boolean                  default false,

  foreign key (bonds_id)   references bonds(id)
);

insert into global_settings
(name, type, value)
values ('BONDS_CODE_PATTERN', 'TEXT', '"Bonds" + bonds_id')