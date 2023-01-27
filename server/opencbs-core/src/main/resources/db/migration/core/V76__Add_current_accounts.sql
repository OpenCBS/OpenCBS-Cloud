create table current_accounts (
  id            serial primary key,
  code          varchar(19) not null,
  profile_id    integer     not null,
  currency_id   integer     not null,
  created_at    timestamp   not null,
  created_by_id integer     not null
);

alter table current_accounts
  add constraint current_accounts_profile_id_fkey foreign key (profile_id) references profiles (id);
alter table current_accounts
  add constraint current_accounts_created_by_id_fkey foreign key (created_by_id) references users (id);

alter table currencies
  add column code varchar(3);
update currencies
set code = '001';
alter table currencies
  alter column code set not null;

insert into global_settings (name, type, value) values ('DEFAULT_CURRENCY_ID', 'LONG', '1');