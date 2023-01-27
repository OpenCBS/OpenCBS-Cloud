drop view view_operation;
create or replace view view_operation as
SELECT aet.accounting_entries_id AS id,
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
   FROM ((((((accounting_entries_tills aet
     LEFT JOIN accounting_entries ae ON ((aet.accounting_entries_id = ae.id)))
     LEFT JOIN profiles_accounts pa ON (((pa.account_id = ae.credit_account_id) OR (pa.account_id = ae.debit_account_id))))
     LEFT JOIN profiles p ON ((pa.profile_id = p.id)))
     LEFT JOIN vaults_accounts va ON (((va.account_id = ae.credit_account_id) OR (va.account_id = ae.debit_account_id))))
     LEFT JOIN vaults v ON ((va.vault_id = v.id)))
     LEFT JOIN accounts a ON ((ae.credit_account_id = a.id)))
  GROUP BY aet.accounting_entries_id, ae.effective_at, p.id, p.name, v.name, ae.amount, aet.operation_type, ae.created_by_id, a.currency_id, ae.description, aet.till_id;

