create table roles (
  id   bigserial primary key,
  name varchar(255) unique
);

create table roles_permissions (
  role_id    integer      not null,
  permission varchar(250) not null
);

alter table roles_permissions
  add constraint roles_permissions_roles_id_fkey foreign key (role_id) references roles (id) match full;

alter table roles_permissions add constraint roles_permissions_role_id_permission_key unique (role_id, permission)