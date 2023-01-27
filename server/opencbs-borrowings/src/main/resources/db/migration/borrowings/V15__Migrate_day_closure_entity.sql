insert into day_closure_contracts
(contract_id, process_type, actual_date)
  select
    borrowing_id, 'BORROWING_ACCRUAL', max(effective_at)
  from
    borrowing_events
  where event_type = 'BORROWING_ACCRUAL'
        and borrowing_id not in
            (select contract_id from day_closure_contracts where process_type = 'BORROWING_ACCRUAL')
  group by borrowing_id, event_type;