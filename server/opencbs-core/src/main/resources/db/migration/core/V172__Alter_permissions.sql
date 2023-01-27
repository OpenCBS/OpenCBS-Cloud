alter table permissions
  add column module_type varchar(255) null;

update permissions
set module_type = 'PROFILES' where name in ('MAKER_FOR_PROFILE', 'CHECKER_FOR_PROFILE');

update permissions
set module_type = 'TILL' where name in ('TELLER', 'HEAD_TELLER');

update permissions
set module_type = 'LOAN' where name in ('PAST/FUTURE_REPAYMENTS', 'PRIMARY_CREDIT_COMMITTEE_MEMBER');

update permissions
set module_type = 'DAY_CLOSURE' where name in ('DAY_CLOSURE');

alter table permissions
  alter column module_type set not null;

alter table permissions rename "group" to description;

alter table roles_permissions
  add column id serial primary key;

alter table permissions
  add column permanent boolean not null default false;

alter table permissions
  add constraint name_unique unique (name);

alter table permissions
  alter column name type varchar(150);

update permissions
set
    name = 'Past / future repayments'
  , permanent = true
  , description = ''
where name = 'PAST/FUTURE_REPAYMENTS';

update permissions
set
    name = 'Primary credit committee member'
  , permanent = true
  , description = 'System will ignore other credit committee vote and set vote of this user as priority.'
where name = 'PRIMARY_CREDIT_COMMITTEE_MEMBER';

update permissions
set
  permanent = true
where name in ('MAKER_FOR_PROFILE', 'CHECKER_FOR_PROFILE', 'HEAD_TELLER', 'TELLER');

insert into permissions(name, description, module_type, permanent)
values
  ('Past / future reschedule', '', 'LOAN', true);

insert into permissions(name, description, module_type, permanent)
values
    ('PROFILES_MODULE', 'MODULE', 'PROFILES', true)
  , ('LOAN_APPLICATION_MODULE', 'MODULE', 'LOAN_APPLICATION', true)
  , ('LOAN_MODULE', 'MODULE', 'LOAN', true)
  , ('ACCOUNTING_ENTRIES_MODULE', 'MODULE', 'ACCOUNTING_ENTRIES', true)
  , ('CHART_OF_ACCOUNTS_MODULE', 'MODULE', 'CHART_OF_ACCOUNTS', true)
  , ('REPORTS_MODULE', 'MODULE', 'REPORTS', true)
  , ('CONFIGURATION_MODULE', 'MODULE', 'CONFIGURATION', true)
  , ('TASK_MANAGEMENT_MODULE', 'MODULE', 'TASK_MANAGEMENT', true)
  , ('TILL_MODULE', 'MODULE', 'TILL', true);