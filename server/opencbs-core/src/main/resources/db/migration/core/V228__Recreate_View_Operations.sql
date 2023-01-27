drop view if exists view_operation;
create view view_operation as
select
      aet.accounting_entries_id id
    , ae.created_at created_at
    , p.id profile_id
    , p.name profile_name
    , v.name vault_name
    , ae.amount amount
    , aet.operation_type operation_type
    , ae.created_by_id created_by_id
    , a.currency_id currency_id
    , ae.description description
    , aet.till_id till_id
from
    accounting_entries_tills aet
left join
    accounting_entries ae on aet.accounting_entries_id = ae.id
left join
    profiles_accounts pa on (pa.account_id = ae.credit_account_id or pa.account_id = ae.debit_account_id)
left join
    profiles p on pa.profile_id = p.id
left join
    vaults_accounts va on (va.account_id = ae.credit_account_id or va.account_id = ae.debit_account_id)
left join
    vaults v on va.vault_id = v.id
left join
    accounts a on ae.credit_account_id = a.id
group by
      aet.accounting_entries_id
    , ae.created_at
    , p.id
    , p.name
    , v.name
    , ae.amount
    , aet.operation_type
    , ae.created_by_id
    , a.currency_id
    , ae.description
    , aet.till_id;