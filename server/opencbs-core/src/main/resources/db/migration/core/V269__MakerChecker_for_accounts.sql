insert into permissions (name, description, module_type, permanent)
values ('CHECKER_FOR_ACCOUNT', '', 'MAKER_CHECKER', true),
       ('MAKER_FOR_ACCOUNT', '', 'MAKER_CHECKER', true);

insert into roles_permissions (role_id, permission_id)
values  (1, (select id from permissions where name = 'CHECKER_FOR_ACCOUNT')),
        (1, (select id from permissions where name = 'MAKER_FOR_ACCOUNT'));

insert into checker_request (permission_id, request_type)
values ((select id from permissions where name = 'CHECKER_FOR_ACCOUNT'), 'ACCOUNT_CREATE'),
       ((select id from permissions where name = 'CHECKER_FOR_ACCOUNT'), 'ACCOUNT_EDIT');