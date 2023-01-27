drop view if exists view_operation;
create view view_operation as
    select * from (
        select
            aet.accounting_entries_id AS id,
            ae.effective_at,
            p.id AS profile_id,
            p.name AS profile_name,
            v.name AS vault_name,
            ae.amount,
            aet.operation_type,
            ae.created_by_id,
            a.currency_id,
            ae.description,
            aet.till_id
        from accounting_entries_tills aet
            left join accounting_entries ae on aet.accounting_entries_id = ae.id
            inner join profiles_accounts pa on pa.account_id = ae.credit_account_id
            left join profiles p on pa.profile_id = p.id
            left join vaults_accounts va on va.account_id = ae.credit_account_id
            left join vaults v on va.vault_id = v.id
            left join accounts a on ae.credit_account_id = a.id

        union all

        select
            aet.accounting_entries_id AS id,
            ae.effective_at,
            p.id AS profile_id,
            p.name AS profile_name,
            v.name AS vault_name,
            ae.amount,
            aet.operation_type,
            ae.created_by_id,
            a.currency_id,
            ae.description,
            aet.till_id
        from accounting_entries_tills aet
            left join accounting_entries ae on aet.accounting_entries_id = ae.id
            inner join profiles_accounts pa on pa.account_id = ae.debit_account_id
            left join profiles p on pa.profile_id = p.id
            left join vaults_accounts va on va.account_id = ae.debit_account_id
            left join vaults v on va.vault_id = v.id
            left join accounts a on ae.credit_account_id = a.id
    ) as result
    group by  result.id, result.effective_at, result.profile_id, result.profile_name, result.vault_name, result.amount, result.operation_type, result.created_by_id, result.currency_id, result.description, result.till_id;
