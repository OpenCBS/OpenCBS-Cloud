-- noinspection SqlNoDataSourceInspectionForFile
create table vaults_accounts (
  vault_id   int not null,
  account_id int not null
);
alter table vaults_accounts
  add constraint vaults_accounts_till_id_fkey foreign key (vault_id) references vaults (id);
alter table vaults_accounts
  add constraint vaults_accounts_account_id_fkey foreign key (account_id) references accounts (id);

alter table vaults
  drop column currency_id;