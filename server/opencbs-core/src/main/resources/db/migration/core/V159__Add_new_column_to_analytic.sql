alter table analytics_active_loans
  add column total_interest numeric(12, 2);

update analytics_active_loans
set total_interest = t.interest
from (select interest.loan_id, interest.interest from analytics_active_loans
  left join lateral (
            select loan_id, sum(interest) interest from get_loan_schedule(analytics_active_loans.loan_id, cast(now() as timestamp)) interest
            group by loan_id) interest on interest.loan_id = analytics_active_loans.loan_id
     ) t
where analytics_active_loans.loan_id = t.loan_id