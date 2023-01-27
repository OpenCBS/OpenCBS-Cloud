with schedule as
(
    select * from get_loan_schedule(:loanId, null )
    where deleted = false
)
  , late_amount as
(
    select
        :loanId                    loan_id
      , coalesce(
            sum(principal)
            + sum(accrued_interest)
            - sum(paid_principal)
            - sum(paid_interest)
            , 0)                   late_amount
    from schedule
    where maturity_date <= :dateTime
)
  , disbursed_payees_sum as
(
    select
        :loanId loan_id
      , sum(p.amount) amount
    from
      loans
      inner join
      loan_applications a ON loans.loan_application_id = a.id and loans.id = :loanId
      inner join
      loan_applications_payees p on a.id = p.loan_application_id
    where
      p.disbursement_date <= :dateTime and p.status = 'DISBURSED'
)
  , payees_sum as
(
    select
        :loanId loan_id
      , sum(p.amount) amount
    from
      loans
      inner join
      loan_applications a ON loans.loan_application_id = a.id and loans.id = :loanId
      inner join
      loan_applications_payees p on a.id = p.loan_application_id
)

select
    :loanId                                     id
  , sum(schedule.principal)
    + sum(schedule.accrued_interest)
    - sum(schedule.paid_principal)
    - sum(schedule.paid_interest)               settlement_balance
  , loans.amount - sum(schedule.paid_principal) olb
  , late_amount.late_amount                     late_amount
  , case
    when p.amount is null THEN null
    when dp.amount is null then loans.amount
    else loans.amount - dp.amount
    end unallocated_amount
from loans
  inner join schedule on loans.id = schedule.loan_id
  inner join late_amount on late_amount.loan_id = loans.id
  inner join disbursed_payees_sum dp on dp.loan_id = loans.id
  inner join payees_sum p on p.loan_id = loans.id
group by
  loans.amount
  , late_amount.late_amount
  , p.amount
  , dp.amount;