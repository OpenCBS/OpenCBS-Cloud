create table tills (
  id        bigserial primary key,
  name      varchar(255) not null,
  branch_id bigint       not null,
  status    varchar(40)
);

alter table tills
  add constraint tills_branch_id_fkey foreign key (branch_id) references branches (id);