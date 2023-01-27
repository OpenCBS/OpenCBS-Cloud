insert into day_closure_entities
  (entity_id, day_closure_container_type, actual_date)
select
  loan_id, 'LOAN_INTEREST_ACCRUAL', max(effective_at)
from
  loans_events
where event_type = 'ACCRUAL_OF_INTEREST'
  and loan_id not in
    (select entity_id from day_closure_entities where day_closure_container_type = 'LOAN_INTEREST_ACCRUAL')
group by loan_id, event_type;
-----------------------------------------------------------------------------------------------------

insert into day_closure_entities
  (entity_id, day_closure_container_type, actual_date)
select
  loan_id, 'LOAN_PENALTY_ACCRUAL', max(effective_at)
from
  loans_events
where event_type = 'LOAN_PENALTY_ACCRUAL'
  and loan_id not in
    (select entity_id from day_closure_entities where day_closure_container_type = 'LOAN_PENALTY_ACCRUAL')
group by loan_id, event_type;

-----------------------------------------------------------------------------------------------------
insert into day_closure_entities
  (entity_id, day_closure_container_type, actual_date)
select
  loan_id, 'LOAN_ANALYTIC', max(calculated_date)
from
  analytics_active_loans
where loan_id not in
  (select entity_id from day_closure_entities where day_closure_container_type = 'LOAN_ANALYTIC')
group by loan_id;