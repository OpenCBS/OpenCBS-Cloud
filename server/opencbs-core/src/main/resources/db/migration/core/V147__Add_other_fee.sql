create table other_fees (
  id          bigserial primary key,
  name        varchar(255) not null,
  description varchar(255),
  created_at  timestamp    not null,
  created_by_id  integer      not null,
  account_id integer not null
);
alter table other_fees
  add constraint other_fees_account_id_fkey foreign key (account_id) references accounts (id);
alter table other_fees
    add constraint other_fees_created_by_id_fkey foreign key (created_by_id) references users (id);