delete from roles_permissions where role_id = 1;
insert into roles_permissions (role_id, permission_id)
    select 1, id
    from permissions;