insert into branches(id, name, code, address)
  select 1, 'Default', '001', ''
  where not exists (select * from branches where id=1);

select setval('branches_id_seq', (select max(id) from branches));

alter table accounts
  add column branch_id integer default 1;
alter table accounts
  add constraint accounts_branch_id_fkey foreign key (branch_id) references branches (id);
alter table accounts alter column branch_id set not null;