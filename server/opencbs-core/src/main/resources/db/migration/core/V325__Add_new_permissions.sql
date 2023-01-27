insert into permissions (name, description, module_type, permanent)
values ('PROVISIONING', '', 'LOANS', false);

insert into roles_permissions (role_id, permission_id)
values  (1, (select id from permissions where name = 'PROVISIONING'));

insert into permissions (name, description, module_type, permanent)
values ('ATTACHMENT', '', 'LOAN_APPLICATIONS', false);

insert into roles_permissions (role_id, permission_id)
values  (1, (select id from permissions where name = 'ATTACHMENT'));

insert into permissions (name, description, module_type, permanent)
values ('GUARANTOR', '', 'LOAN_APPLICATIONS', false);

insert into roles_permissions (role_id, permission_id)
values  (1, (select id from permissions where name = 'GUARANTOR'));

insert into permissions (name, description, module_type, permanent)
values ('COLLATERAL', '', 'LOAN_APPLICATIONS', false);

insert into roles_permissions (role_id, permission_id)
values  (1, (select id from permissions where name = 'COLLATERAL'));