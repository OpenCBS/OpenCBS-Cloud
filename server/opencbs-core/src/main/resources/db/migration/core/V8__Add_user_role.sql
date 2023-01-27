insert into roles (id, name)
values
  (1, 'admin');
insert into roles_permissions (role_id, permission)
values
  (1, 'ALL');

alter table users
  add role_id integer not null default 1;
alter table users
  alter column role_id set not null;
alter table users
  add constraint users_role_id_fkey foreign key (role_id) references roles (id) match full;