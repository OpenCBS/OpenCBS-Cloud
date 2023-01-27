create table accounting_entries_tills (
    id                    bigserial primary key,
    accounting_entries_id bigint      not null references accounting_entries unique,
    operation_type        varchar(50) not null,
    initiated_by          bigint      not null references profiles,
    till_id               bigint      not null references tills
);

insert into accounting_entries_tills(accounting_entries_id, operation_type, initiated_by, till_id)
    select
        entry.id,
        entry.extra ->> 'type',
        1,
        1
    from
        accounting_entries entry
    where
        (entry.extra ->> 'type' = 'DEPOSIT' or entry.extra ->> 'type' = 'WITHDRAW');

drop function get_operations(bigint, bigint, timestamp without time zone, timestamp without time zone);

create or replace function get_operations(bigint, bigint, timestamp without time zone, timestamp without time zone)
    returns TABLE(id bigint, created_at timestamp without time zone, profile_id bigint, profile_name character varying, vault_name character varying, amount numeric, operation_type character varying, created_by_id bigint, currency_id bigint, description character varying)
LANGUAGE SQL
AS $$
select
  ae.id
  , ae.created_at
  , pa.profile_id
  , p.name as profile_name
  , v.name as vault_name
  , ae.amount
  , till_entries.operation_type
  , ae.created_by_id
  , a.currency_id
  , ae.description
from
  tills_accounts ta
  inner join
    accounting_entries ae on ae.credit_account_id = ta.account_id
                           or ae.debit_account_id = ta.account_id
  inner join accounting_entries_tills till_entries
      on till_entries.accounting_entries_id = ae.id
  left join
  profiles_accounts pa
    on pa.account_id = ae.credit_account_id
       or pa.account_id = ae.debit_account_id
  left join
  vaults_accounts va
    on va.account_id = ae.credit_account_id
       or va.account_id = ae.debit_account_id
  left join
  accounts a on a.id = ta.account_id
  left join
  profiles p on p.id = pa.profile_id
  left join vaults v on v.id = va.vault_id
where
  ta.till_id = $1
  and $3 <= ae.created_at and ae.created_at <= $4
  and (0 = $2 or a.currency_id = $2)
order by
  created_at;
$$;