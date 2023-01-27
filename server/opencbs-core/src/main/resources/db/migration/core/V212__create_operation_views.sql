DROP VIEW IF EXISTS view_operation;
CREATE VIEW view_operation AS
select
  ae.id
  , ae.created_at
  , pa.profile_id
  , p.name as profile_name
  , v.name as vault_name
  , ae.amount
  , coalesce(ae.extra ->> 'type', 'Other') as operation_type
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
  vaults_accounts va
    on va.account_id = ae.credit_account_id
       or va.account_id = ae.debit_account_id
  left join
  accounts a on a.id = ta.account_id
  left join
  profiles p on p.id = pa.profile_id
  left join vaults v on v.id = va.vault_id
order by
  created_at;