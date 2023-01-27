alter table bonds add column branch_id bigint default 1 not null;

alter table bonds
  add constraint bonds_branch_id_fkey
foreign key (branch_id) references branches (id);