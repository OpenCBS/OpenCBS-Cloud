alter table savings add column branch_id bigint default 1 not null;

alter table savings
  add constraint savings_branch_id_fkey
foreign key (branch_id) references branches (id);