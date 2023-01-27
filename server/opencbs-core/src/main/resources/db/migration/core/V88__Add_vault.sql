create table vaults (
  id bigserial primary key,
  name varchar(255) not null,
  currency_id integer not null,
  branch_id integer not null
);

alter table vaults
  add constraint vaults_currency_id_fkey foreign key (currency_id) references currencies (id) match full;

alter table vaults
  add constraint vaults_branch_id_fkey foreign key (branch_id) references branches (id) match full;