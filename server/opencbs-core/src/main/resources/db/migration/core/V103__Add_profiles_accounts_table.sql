-- noinspection SqlNoDataSourceInspectionForFile
create table profiles_accounts (
  id         bigserial primary key,
  profile_id int not null,
  account_id int not null
);

alter table profiles_accounts
  add constraint profiles_accounts_profile_id_fkey foreign key (profile_id) references profiles (id);
alter table profiles_accounts
  add constraint profiles_accounts_account_id_fkey foreign key (account_id) references accounts (id);

--alter table accounts drop constraint accounts_currency_id_fkey;
alter table accounts add constraint accounts_number_key unique(number);

insert into accounts (number, "name", is_debit, parent_id, start_date, close_date, "type", lft, rgt, currency_id)
  values ('2000', 'Liability Accounts', false , null, '2017-01-01', null, 1, 0, 0, null);
insert into accounts (number, "name", is_debit, parent_id, start_date, close_date, "type", lft, rgt, currency_id)
  values ('2100', 'Current Accounts', false , (select id from accounts where number = '2000' limit 1), '2017-01-01', null, 2, 0, 0, null);
insert into accounts (number, "name", is_debit, parent_id, start_date, close_date, "type", lft, rgt, currency_id)
  values ('2101', 'Current Account USD', false , (select id from accounts where number = '2100' limit 1), '2017-01-01', null, 4, 0, 0, 1);

insert into global_settings("name", "type", "value")
  values ('DEFAULT_CURRENT_ACCOUNT_GROUP', 'TEXT', '2100');

drop table current_accounts;

