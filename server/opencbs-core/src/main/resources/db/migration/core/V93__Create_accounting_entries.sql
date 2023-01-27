create table accounts (
  id         bigserial primary key,
  number     varchar(32)  not null,
  name       varchar(255) not null,
  is_debit   boolean      not null,
  parent_id  integer,
  start_date timestamp    not null,
  close_date timestamp    null,
  type       integer,
  lft        integer      null,
  rgt        integer      null
);


create table accounting_entries (
  id                bigserial primary key,
  debit_account_id  bigint         not null,
  credit_account_id bigint         not null,
  amount            decimal(14, 4) not null,
  created_at        timestamp      not null,
  created_by_id     integer        not null,
  branch_id         integer        not null,
  description       varchar(255)   not null
);
alter table accounting_entries
  add constraint accounting_entries_created_by_id_fkey foreign key (created_by_id) references users (id) match full;

alter table accounting_entries
  add constraint accounting_entries_debit_account_id_fkey foreign key (debit_account_id) references accounts (id) match full;

alter table accounting_entries
  add constraint accounting_entries_credit_account_id_fkey foreign key (credit_account_id) references accounts (id) match full;

alter table accounting_entries
  add constraint accounting_entries_branch_id_fkey foreign key (branch_id) references branches (id) match full;