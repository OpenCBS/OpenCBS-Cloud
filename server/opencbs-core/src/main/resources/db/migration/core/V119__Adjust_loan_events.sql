alter table loans_events
    add column roled_back_by_id integer,
    add column rolled_back_date timestamp;
alter table loans_events
  add constraint loans_events_roled_back_by_id_fkey foreign key (roled_back_by_id) references users (id);

alter table loans_installments
    add column deleted boolean;


-- noinspection SqlNoDataSourceInspectionForFile

drop function if exists get_loan_schedule(bigint, timestamp without time zone);

create function get_loan_schedule(bigint, timestamp without time zone)
  returns table (
    id bigint
  , number integer
  , loan_id bigint
  , start_date date
  , maturity_date date
  , accrual_start_date date
  , last_accrual_date date
  , effective_at timestamp without time zone
  , penalty numeric(12, 2)
  , paid_penalty numeric(12, 2)
  , interest numeric(12, 2)
  , accrued_interest numeric(12, 2)
  , paid_interest numeric(12, 2)
  , principal numeric(12, 2)
  , paid_principal numeric(12, 2)
  , olb numeric(12, 2)
  , event_group_key integer
  , deleted boolean
  )
language sql
as $$

with i as
(
    select
      *
    from
      (
        -- Select only the most recent installment log entries
        select
          *
        from
          (
            -- Select installment log entries for a given loan and effective as of a given timestamp
            select
              *
              , row_number() over (partition by number order by effective_at desc) rank
            from
              loans_installments
            where
              loan_id = $1
              and ($2 is null or effective_at <= $2)
              and deleted = false
          ) logs
        where
          logs.rank = 1
      ) i
)
  , ii as
(
    select
      i1.*
      , case when i1.number = 1 then l.disbursement_date else i2.maturity_date end start_date
      , case when i1.number = 1 then l.disbursement_date else i2.last_accrual_date end accrual_start_date
    from
      i i1
      left join
      i i2 on i1.number = i2.number + 1
      left join
      loans l on l.id = i1.loan_id
)

select
  ii.id
  , ii.number
  , ii.loan_id
  , ii.start_date
  , ii.maturity_date
  , ii.accrual_start_date
  , ii.last_accrual_date
  , ii.effective_at
  , coalesce(e.accrued_penalty, 0.00) penalty
  , coalesce(e.paid_penalty, 0.00) paid_penalty
  , ii.interest
  , coalesce(e.accrued_interest, 0.00) accrued_interest
  , ii.paid_interest
  , ii.principal
  , ii.paid_principal
  , ii.olb
  , ii.event_group_key
  , ii.deleted
from
  ii
  left join
  (
    -- Select accrued interest, accrued penalty, and paid penalty
    select
      loan_id
      , installment_number
      , sum(case when event_type = 'ACCRUAL_OF_INTEREST' then amount else 0.00 end) accrued_interest
      , sum(case when event_type = 'ACCRUAL_OF_PENALTY' then amount else 0.00 end) accrued_penalty
      , sum(case when event_type = 'REPAYMENT_OF_PENALTY' then amount else 0.00 end) paid_penalty
    from
      loans_events
    where
      loan_id = $1
      and ($2 is null or effective_at <= $2)
      and event_type in ('ACCRUAL_OF_INTEREST', 'ACCRUAL_OF_PENALTY', 'REPAYMENT_OF_PENALTY')
      and deleted = false
    group by
      loan_id, installment_number
  ) e on e.loan_id = ii.loan_id and e.installment_number = ii.number
order by
  ii.number
$$;