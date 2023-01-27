INSERT INTO day_closure_contracts(contract_id, process_type, actual_date, branch_id)
SELECT id, 'LOAN_PENALTY_ACCRUAL', disbursement_date, branch_id
FROM loans
WHERE disbursement_date IS NOT NULL;