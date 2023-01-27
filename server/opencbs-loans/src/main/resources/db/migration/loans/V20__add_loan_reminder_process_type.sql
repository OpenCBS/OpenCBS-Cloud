insert into day_closure_contracts (contract_id, process_type, actual_date)
select contract_id, 'LOAN_REMINDER_PROCESS', max(actual_date) from day_closure_contracts
where process_type like 'LOAN_%'
group by contract_id