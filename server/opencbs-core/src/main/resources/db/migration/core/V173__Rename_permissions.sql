update permissions
set
  name = 'PAST_FUTURE_REPAYMENTS'
where name = 'Past / future repayments';

update permissions
set
  name = 'PAST_FUTURE_RESCHEDULE'
where name = 'Past / future reschedule';

update permissions
set
  name = 'PRIMARY_CREDIT_COMMITTEE_MEMBER'
where name = 'Primary credit committee member';

insert into roles_permissions(role_id, permission_id)
  select
    1
    , p.id
  from
    permissions p
  where
    p.id not in (select rp.permission_id from roles_permissions rp where role_id = 1)