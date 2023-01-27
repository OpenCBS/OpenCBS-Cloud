insert into permissions (name, description, module_type, permanent)
values ('CHECKER_FOR_PEOPLE', '', 'MAKER_CHECKER', true),
       ('MAKER_FOR_PEOPLE', '', 'MAKER_CHECKER', true),
       ('CHECKER_FOR_COMPANY', '', 'MAKER_CHECKER', true),
       ('MAKER_FOR_COMPANY', '', 'MAKER_CHECKER', true),
       ('CHECKER_FOR_GROUP', '', 'MAKER_CHECKER', true),
       ('MAKER_FOR_GROUP', '', 'MAKER_CHECKER', true);

insert into roles_permissions (role_id, permission_id)
values  (1, (select id from permissions where name = 'CHECKER_FOR_PEOPLE')),
        (1, (select id from permissions where name = 'MAKER_FOR_PEOPLE')),
        (1, (select id from permissions where name = 'CHECKER_FOR_COMPANY')),
        (1, (select id from permissions where name = 'MAKER_FOR_COMPANY')),
        (1, (select id from permissions where name = 'CHECKER_FOR_GROUP')),
        (1, (select id from permissions where name = 'MAKER_FOR_GROUP'));

insert into checker_request (permission_id, request_type)
values ((select id from permissions where name = 'CHECKER_FOR_PEOPLE'), 'PEOPLE_CREATE'),
       ((select id from permissions where name = 'CHECKER_FOR_PEOPLE'), 'PEOPLE_EDIT'),
       ((select id from permissions where name = 'CHECKER_FOR_COMPANY'), 'COMPANY_CREATE'),
       ((select id from permissions where name = 'CHECKER_FOR_COMPANY'), 'COMPANY_EDIT'),
       ((select id from permissions where name = 'CHECKER_FOR_GROUP'), 'GROUP_CREATE'),
       ((select id from permissions where name = 'CHECKER_FOR_GROUP'), 'GROUP_EDIT');

delete from global_settings
where name = 'USE_MAKER_AND_CHECKER';