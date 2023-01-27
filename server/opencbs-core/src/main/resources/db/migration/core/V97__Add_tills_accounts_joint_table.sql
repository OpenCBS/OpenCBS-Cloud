-- noinspection SqlNoDataSourceInspectionForFile
create table tills_accounts (
  till_id    int not null,
  account_id int not null
);
alter table tills_accounts
  add constraint tills_accounts_till_id_fkey foreign key (till_id) references tills (id);
alter table tills_accounts
  add constraint tills_accounts_account_id_fkey foreign key (account_id) references accounts (id);

alter table accounts
  add currency_id int;

alter table accounts
  add constraint accounts_currency_id_fkey foreign key (currency_id) references currencies (id);

update accounts
set currency_id = 1