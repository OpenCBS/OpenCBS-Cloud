drop function get_active_loan(bigint, timestamp without time zone);

alter table analytics_active_loans
  add column next_repayment_id bigint;

create or replace function get_active_loan(bigint, timestamp without time zone) returns TABLE(loan_id bigint, disbursement_date date, planned_close_date date, close_date timestamp without time zone, profile_id integer, profile_name character varying, profile_type character varying, loan_product_id integer, loan_product_name character varying, loan_products_currency_id integer, loan_products_currency_name character varying, loan_purpose_id integer, loan_purpose_name character varying, loan_officer_id integer, loan_officer_name character varying, branch_id bigint, branch_name character varying, branch_code character varying, address text, interest_rate numeric, interest numeric, principal numeric, olb numeric, late_principal numeric, late_interest numeric, interest_due numeric, penalty_due numeric, late_days integer, next_repayment_id bigint)
language sql
as $$
with planned_close_date as
(
    select
      installments.loan_id,
      max(installments.maturity_date) planned_close_date
    from loans_installments installments
      inner join (select
                    loan_id,
                    min(event_group_key) event_group_key
                  from loans_installments
                  where loan_id = $1
                  group by loan_id
                 ) min_group_key
        on (installments.loan_id = min_group_key.loan_id
            and installments.event_group_key = min_group_key.event_group_key)
    where installments.loan_id = $1
    group by installments.loan_id
)
  , close_date as
(
    select
      loan_id,
      created_at close_date
    from loans_events
    where loan_id = $1
          and deleted = false
          and event_type = 'CLOSING'
          and effective_at <= $2::timestamp
)
  , schedule as
(
    select
      id
      , loan_id
      , interest
      , principal
      , start_date
      , maturity_date
      , paid_principal
      , paid_interest
      , paid_penalty
      , olb olb
    from (select *
          from get_loan_schedule($1, $2)) i
    group by id
      , loan_id
      , interest
      , principal
      , start_date
      , maturity_date
      , paid_principal
      , paid_interest
      , paid_penalty
      , olb
)
  , next_repayment as
(
    select
      loan_id,
      id
    from schedule i
    where $2 > i.start_date :: date and $2 :: date <= i.maturity_date :: date
)
  , interest_principal as
(
    select
      loan_id loan_id
      , sum(interest) - sum(paid_interest) interest
      , sum(principal) - sum(paid_principal) principal
    from schedule i
    group by
      loan_id
)
  , olb as
(
    select
      loan_id,
      olb olb
    from schedule i
    where $2 >= i.start_date :: date and $2::date < i.maturity_date :: date
)
  , late_principal as
(
  select
      loan_id
    , sum(late_principal) late_principal
  from (
    select
      loan_id,
      sum(principal) - sum(paid_principal) late_principal
    from (select *
          from schedule
          where schedule.maturity_date :: date < $2 :: date) i
    group by loan_id
    union all
    select $1, 0) x
  group by loan_id
  limit 1
)
  , late_interest as
(
  select
      loan_id
    , sum(late_interest) late_interest
  from (
    select
      loan_id,
      sum(interest) - sum(paid_interest) late_interest
    from (select *
          from schedule
          where maturity_date :: date < $2 :: date) i
    group by loan_id
    union all
    select $1, 0) x
  group by loan_id
  limit 1
)
  , late_days as
(
  select
      loan_id
    , sum(late_days)::integer late_days
  from (
    select
      loan_id,
      case
      when -- total to pay < paid
        (sum(interest) + sum(principal))
        >
        (sum(paid_interest) + sum(paid_principal))
        then
          DATE_PART('day', $2::timestamp - min(maturity_date) :: timestamp) :: integer
      else 0
      end late_days
    from (select *
          from schedule
          where maturity_date :: timestamp <= $2::timestamp) i
    group by loan_id
    union all
    select $1, 0) x
  group by loan_id
  limit 1
)
  , interest_due as
(
    select
      $1          loan_id,
      coalesce(
          (select sum(amount)
           from loans_events
           where loan_id = $1
                 and event_type = 'ACCRUAL_OF_INTEREST'
                 and deleted = false
                 and effective_at :: timestamp <= $2::timestamp)
          -
          (select sum(paid_interest)
           from (select *
                 from schedule
                 where maturity_date :: timestamp <= $2::timestamp) i)
          , 0) as interest_due
)
  , penalty_due as
(
    select
      $1          loan_id,
      coalesce(
          (select sum(amount)
           from loans_events
           where loan_id = $1
                 and event_type = 'ACCRUAL_OF_PENALTY'
                 and deleted = false
                 and effective_at :: timestamp <= $2::timestamp)
          -
          (select sum(paid_penalty)
           from (select *
                 from schedule
                 where maturity_date :: timestamp <= $2::timestamp) i)
          , 0) as penalty_due
)

select
  loans.id                                                   loan_id,
  loans.disbursement_date                                    disbursement_date,
  planned_close_date.planned_close_date                      planned_close_date,
  close_date.close_date                                      close_date,
  application.profile_id                                     profile_id,
  profiles.name                                              profile_name,
  profiles.type                                              profile_type,
  application.loan_product_id                                loan_product_id,
  loan_products.name                                         loan_product_name,
  loan_products.currency_id                                  loan_products_currency_id,
  loan_products_currencies.name                              loan_products_currency_name,
  0                                                          loan_purpose_id
  -- todo it's mock, relation loan to purpose are absent
  ,
  'mock_loan_purpose' :: varchar(200)                        loan_purpose_name
  -- todo it's mock, relation loan to purpose are absent
  ,
  loans.created_by_id                                        loan_officer_id,
  users.first_name :: text || ' ' || users.last_name :: text loan_officer_name,
  branches.id                                                branch_id,
  branches.name                                              branch_name,
  branches.code                                              branch_code,
  'mock_address' :: text                                     address
  -- todo address column are absent, may be it should select from custom fields?
  ,
  loans.interest_rate                                        interest_rate,
  interest_principal.interest                                interest,
  interest_principal.principal                               principal,
  olb.olb                                                    olb,
  late_principal.late_principal                              late_principal,
  late_interest.late_interest                                late_interest,
  interest_due.interest_due                                  interest_due,
  penalty_due.penalty_due                                    penalty_due,
  late_days.late_days                                        late_days,
  next_repayment.id                                          next_repayment_id
from loans
  inner join loan_applications application
    on (application.id = loans.loan_application_id)
  inner join profiles
    on (profiles.id = application.profile_id)
  inner join loan_products loan_products
    on (loan_products.id = application.loan_product_id)
  inner join currencies loan_products_currencies
    on (loan_products_currencies.id = loan_products.currency_id)
  inner join users
    on (loans.created_by_id = users.id)
  inner join branches
    on (branches.id = users.branch_id)
  inner join planned_close_date
    on (planned_close_date.loan_id = loans.id)
  left join close_date
    on (close_date.loan_id = loans.id)
  inner join next_repayment
    on (next_repayment.loan_id = loans.id)
  inner join interest_principal
    on (interest_principal.loan_id = loans.id)
  inner join olb
    on (olb.loan_id = loans.id)
  inner join late_principal
    on (late_principal.loan_id = loans.id)
  inner join late_interest
    on (late_interest.loan_id = loans.id)
  inner join interest_due
    on (interest_due.loan_id = loans.id)
  inner join penalty_due
    on (penalty_due.loan_id = loans.id)
  inner join late_days
    on (late_days.loan_id = loans.id)
where
  loans.id = $1;
$$;
