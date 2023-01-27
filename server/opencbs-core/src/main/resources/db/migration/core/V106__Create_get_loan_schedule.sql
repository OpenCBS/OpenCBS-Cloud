-- noinspection SqlNoDataSourceInspectionForFile

drop function if exists get_loan_schedule(bigint, timestamp without time zone);

create function get_loan_schedule(bigint, timestamp without time zone)
  returns table (
    id bigint
  , number integer
  , loan_id bigint
  , maturity_date date
  , last_accrual_date date
  , effective_at timestamp without time zone
  , interest numeric(12, 2)
  , principal numeric(12, 2)
  , paid_interest numeric(12, 2)
  , paid_principal numeric(12, 2)
  , olb numeric(12, 2)
  , event_group_key integer
  )
language sql
as $$
select
  id
  , number
  , loan_id
  , maturity_date
  , last_accrual_date
  , effective_at
  , interest
  , principal
  , paid_interest
  , paid_principal
  , olb
  , event_group_key
from
  (
    select
      *
    from
      (
        select
          *
          , row_number() over (partition by number order by effective_at desc) rank
        from
          loans_installments
        where
          loan_id = $1 and effective_at <= $2
      ) t
    where
      t.rank = 1
  ) i
$$;
