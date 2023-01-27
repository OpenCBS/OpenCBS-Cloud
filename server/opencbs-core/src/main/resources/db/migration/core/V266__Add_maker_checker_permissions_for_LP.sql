insert into permissions (name, description, module_type, permanent)
values ('CHECKER_FOR_LOAN_PRODUCT', '', 'MAKER_CHECKER', true),
       ('MAKER_FOR_LOAN_PRODUCT', '', 'MAKER_CHECKER', true),
       ('CHECKER_FOR_SAVING_PRODUCT', '', 'MAKER_CHECKER', true),
       ('MAKER_FOR_SAVING_PRODUCT', '', 'MAKER_CHECKER', true),
       ('CHECKER_FOR_USER', '', 'MAKER_CHECKER', true),
       ('MAKER_FOR_USER', '', 'MAKER_CHECKER', true);

insert into roles_permissions (role_id, permission_id)
values  (1, (select id from permissions where name = 'CHECKER_FOR_LOAN_PRODUCT')),
        (1, (select id from permissions where name = 'MAKER_FOR_LOAN_PRODUCT')),
        (1, (select id from permissions where name = 'CHECKER_FOR_SAVING_PRODUCT')),
        (1, (select id from permissions where name = 'MAKER_FOR_SAVING_PRODUCT')),
        (1, (select id from permissions where name = 'CHECKER_FOR_USER')),
        (1, (select id from permissions where name = 'MAKER_FOR_USER'));

insert into checker_request (permission_id, request_type)
values ((select id from permissions where name = 'CHECKER_FOR_LOAN_PRODUCT'), 'LOAN_PRODUCT_CREATE'),
       ((select id from permissions where name = 'CHECKER_FOR_LOAN_PRODUCT'), 'LOAN_PRODUCT_EDIT'),
       ((select id from permissions where name = 'CHECKER_FOR_SAVING_PRODUCT'), 'SAVING_PRODUCT_CREATE'),
       ((select id from permissions where name = 'CHECKER_FOR_SAVING_PRODUCT'), 'SAVING_PRODUCT_EDIT'),
       ((select id from permissions where name = 'CHECKER_FOR_USER'), 'USER_CREATE'),
       ((select id from permissions where name = 'CHECKER_FOR_USER'), 'USER_EDIT');

alter table system_settings
  add column section varchar(255);

update system_settings
set value = 60
where name = 'EXPIRATION_SESSION_TIME_IN_MINUTES';

update system_settings
set value = 4
where name = 'PASSWORD_LENGTH';

update system_settings
set section = 'PASSWORD';

update system_settings
set type = 'NUMERIC'
where name = 'PASSWORD_LENGTH';

update system_settings
set type = 'NUMERIC'
where name = 'EXPIRATION_SESSION_TIME_IN_MINUTES';

update system_settings
set type = 'CHECKBOX'
where name = 'UPPER_CASE';

update system_settings
set type = 'CHECKBOX'
where name = 'NUMBERS';

update system_settings
set type = 'CHECKBOX'
where name = 'FIRST_LOG_IN';