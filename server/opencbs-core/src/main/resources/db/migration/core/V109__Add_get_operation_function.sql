-- noinspection SqlNoDataSourceInspectionForFile
alter table accounting_entries
  add column extra jsonb;

create or replace function get_operations(bigint,
    bigint, timestamp without time zone, timestamp without time zone)
  returns table(
    id             bigint
  , created_at     timestamp without time zone
  , profile_id     integer
  , profile_name   character varying
  , amount         numeric
  , operation_type character varying
  , created_by_id  integer
  , currency_id    integer
  , description    character varying)
language sql
as $$
select
  ae.id
  , ae.created_at
  , pa.profile_id
  , p.name as profile_name
  , ae.amount
  , coalesce(ae.extra ->> 'type', 'Other')
  , ae.created_by_id
  , a.currency_id
  , ae.description
from
  tills_accounts ta
inner join
  accounting_entries ae on ae.credit_account_id = ta.account_id
                           or ae.debit_account_id = ta.account_id
left join
  profiles_accounts pa
    on pa.account_id = ae.credit_account_id
       or pa.account_id = ae.debit_account_id
left join
  accounts a on a.id = ta.account_id
left join
  profiles p on p.id = pa.profile_id
where
  ta.till_id = $1
  and $3 <= ae.created_at and ae.created_at <= $4
  and  (0 = $2 or a.currency_id = $2)
order by
  created_at;
$$;