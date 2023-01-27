alter table request
  alter content drop not null;

insert into permissions (name, description, module_type, permanent)
values ('CHECKER_FOR_LOAN_DISBURSEMENT', '', 'MAKER_CHECKER', true),
  ('MAKER_FOR_LOAN_DISBURSEMENT', '', 'MAKER_CHECKER', true),
  ('CHECKER_FOR_LOAN_REPAYMENT', '', 'MAKER_CHECKER', true),
  ('MAKER_FOR_LOAN_REPAYMENT', '', 'MAKER_CHECKER', true),
  ('CHECKER_FOR_LOAN_ROLLBACK', '', 'MAKER_CHECKER', true),
  ('MAKER_FOR_LOAN_ROLLBACK', '', 'MAKER_CHECKER', true);

insert into roles_permissions (role_id, permission_id)
values (1, (select id
            from permissions
            where name = 'CHECKER_FOR_LOAN_DISBURSEMENT')),
  (1, (select id
       from permissions
       where name = 'MAKER_FOR_LOAN_DISBURSEMENT')),
  (1, (select id
       from permissions
       where name = 'CHECKER_FOR_LOAN_REPAYMENT')),
  (1, (select id
       from permissions
       where name = 'MAKER_FOR_LOAN_REPAYMENT')),
  (1, (select id
       from permissions
       where name = 'CHECKER_FOR_LOAN_ROLLBACK')),
  (1, (select id
       from permissions
       where name = 'MAKER_FOR_LOAN_ROLLBACK'));

insert into checker_request (permission_id, request_type)
values ((select id
         from permissions
         where name = 'CHECKER_FOR_LOAN_DISBURSEMENT'), 'LOAN_DISBURSEMENT'),
  ((select id
    from permissions
    where name = 'CHECKER_FOR_LOAN_REPAYMENT'), 'LOAN_REPAYMENT'),
  ((select id
    from permissions
    where name = 'CHECKER_FOR_LOAN_ROLLBACK'), 'LOAN_ROLLBACK');

alter table request
  add column entity_id bigint not null default 0;