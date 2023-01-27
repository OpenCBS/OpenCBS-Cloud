-- noinspection SqlNoDataSourceInspectionForFile
drop table if exists roles_permissions;

create table roles_permissions (
  role_id       int not null,
  permission_id int not null
);

alter table roles_permissions
  add constraint roles_permissions_roles_id_fkey foreign key (role_id) references roles (id);

alter table roles_permissions
  add constraint roles_permissions_permission_id_fkey foreign key (permission_id) references permissions (id);

alter table roles_permissions
  add constraint roles_permissions_role_id_permission_id_key unique (role_id, permission_id);

insert into roles_permissions (role_id, permission_id)
values
  (1, 1),
  (1, 2),
  (1, 3),
  (1, 4);