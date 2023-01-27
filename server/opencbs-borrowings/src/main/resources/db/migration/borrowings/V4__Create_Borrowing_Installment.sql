create table borrowings_installments (
  id                           bigserial             primary key,
  borrowing_id                 bigint                   not null,
  number                       integer                  not null,
  maturity_date                date                     not null,
  interest                     numeric(12, 2)           not null,
  principal                    numeric(12, 2)           not null,
  paid_principal               numeric(12, 2) default 0 not null,
  paid_interest                numeric(12, 2) default 0 not null,
  olb                          numeric(12, 2)           not null,
  last_accrual_date            date                     not null,
  event_group_key              integer                      null,
  effective_at                 timestamp                not null,
  deleted                      boolean,
  rescheduled                  boolean        default false,

  foreign key (borrowing_id)   references borrowings(id)
);

create index borrowings_installments_borrowing_id_idx
  on borrowings_installments (borrowing_id);

alter table borrowings add column borrowing_product_id integer not null;

alter table borrowings
  add constraint borrowing_product_id_fkey
foreign key (borrowing_product_id)
  references borrowing_products(id);

insert into global_settings
  (name, type, value)
values ('BORROWING_CODE_PATTERN', 'TEXT', '"Borrowing" + borrowing_id')