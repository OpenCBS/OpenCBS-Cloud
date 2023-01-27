insert into day_closure_contracts (contract_id, process_type, actual_date, error_message, branch_id)
    (select contract_id, 'LOAN_AUTO_REPAYMENT', actual_date, null, branch_id
     from day_closure_contracts where process_type = 'LOAN_INTEREST_ACCRUAL');
