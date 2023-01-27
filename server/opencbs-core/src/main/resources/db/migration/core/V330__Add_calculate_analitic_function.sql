create or replace function _calculate_analitic_(_loanId bigint, _datetime timestamp without time zone)
    returns TABLE
            (
                loan_id                     bigint,
                calculated_date             date,
                disbursement_date           timestamp without time zone,
                planned_close_date          timestamp without time zone,
                close_date                  timestamp without time zone,
                profile_id                  bigint,
                profile_name                character varying,
                profile_type                character varying,
                loan_product_id             bigint,
                loan_product_name           character varying,
                loan_products_currency_id   bigint,
                loan_products_currency_name character varying,
                loan_purpose_id             bigint,
                loan_purpose_name           character varying,
                loan_officer_id             bigint,
                loan_officer_name           character varying,
                branch_id                   bigint,
                branch_name                 character varying,
                address                     text,
                interest_rate               numeric,
                interest                    numeric,
                principal                   numeric,
                total_interest              numeric,
                olb                         numeric,
                late_principal              numeric,
                late_interest               numeric,
                interest_due                numeric,
                penalty_due                 numeric,
                late_days                   integer,
                next_repayment_id           bigint
            )
    language sql
as
$$
with planned_close_date as
    (
        select installments.loan_id
             , max(installments.maturity_date) planned_close_date
        from loans_installments installments
                 inner join (
            select loan_id
                 , min(event_group_key) event_group_key
            from loans_installments
            where loan_id = _loanId
            group by loan_id
        ) min_group_key
                            on (installments.loan_id = min_group_key.loan_id
                                and installments.event_group_key = min_group_key.event_group_key)
        where installments.loan_id = _loanId
        group by installments.loan_id
    )
   , close_date as
    (
        select loan_id
             , created_at close_date
        from loans_events
        where loan_id = _loanId
          and deleted = false
          and event_type in ('CLOSED', 'WRITE_OFF_OLB')
          and effective_at <= cast(_dateTime as timestamp)
        order by created_at
    )
   , schedule as
    (
        select id
             , loan_id
             , interest
             , principal
             , start_date
             , maturity_date
             , paid_principal
             , paid_interest
             , paid_penalty
             , olb olb
        from (
                 select *
                 from get_loan_schedule(_loanId, _dateTime)) i
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
   , events as
    (
        select loan_id
             , event_type
             , amount
             , effective_at
        from loans_events
        where loan_id = _loanId
          and event_type in ('ACCRUAL_OF_INTEREST', 'ACCRUAL_OF_PENALTY', 'REPAYMENT_OF_PRINCIPAL')
          and effective_at <= _dateTime
          and deleted = false
    )
   , next_repayment as
    (
        select loan_id
             , id
        from schedule
        where start_date = (
            select min(start_date)
            from schedule
            where paid_principal + paid_interest < principal + interest
        )
    )
   , interest_principal as
    (
        select loan_id                              loan_id
             , sum(interest) - sum(paid_interest)   unpaid_interest
             , sum(principal) - sum(paid_principal) unpaid_principal
             , sum(interest)                        total_interest
        from schedule i
        group by loan_id
    )
   , olb as
    (
        select loans.id                                       loan_id
             , loans.amount - coalesce(sum(events.amount), 0) olb
        from loans
                 left join events
                           on events.loan_id = loans.id
                               and events.event_type = 'REPAYMENT_OF_PRINCIPAL'
        group by loans.id, loans.amount
    )
   , late_principal as
    (
        select loan_id
             , sum(late_principal) late_principal
        from (
                 select loan_id
                      , sum(principal) - sum(paid_principal) late_principal
                 from (
                          select *
                          from schedule
                          where cast(schedule.maturity_date as date) < cast(_dateTime as date)) i
                 group by loan_id
                 union all
                 select _loanId
                      , 0) x
        group by loan_id
        limit 1
    )
   , late_interest as
    (
        select loan_id
             , sum(late_interest) late_interest
        from (
                 select loan_id
                      , sum(interest) - sum(paid_interest) late_interest
                 from (
                          select *
                          from schedule
                          where cast(maturity_date as date) < cast(_dateTime as date)) i
                 group by loan_id
                 union all
                 select _loanId
                      , 0) x
        group by loan_id
        limit 1
    )
   , late_days as
    (
        select loan_id
             , cast(sum(late_days) as integer) late_days
        from (
                 select loan_id
                      , case
                            when -- total to pay < paid
                                    (sum(interest) + sum(principal))
                                    >
                                    (sum(paid_interest) + sum(paid_principal))
                                then
                                cast(DATE_PART('day',
                                               cast(_dateTime as timestamp) - cast(min(maturity_date) as timestamp)) as
                                    integer)
                            else 0
                     end late_days
                 from (
                          select *
                          from schedule
                          where cast(maturity_date as timestamp) <= cast(_dateTime as timestamp)) i
                 group by loan_id
                 union all
                 select _loanId
                      , 0) x
        group by loan_id
        limit 1
    )
   , interest_due as
    (
        select _loanId loan_id
             , coalesce(
                    (
                        select coalesce(sum(amount), 0)
                        from events
                        where event_type = 'ACCRUAL_OF_INTEREST'
                          and cast(effective_at as timestamp) <= cast(_dateTime as timestamp))
                    -
                    (
                        select coalesce(sum(paid_interest), 0)
                        from (
                                 select *
                                 from schedule
                                 where cast(maturity_date as timestamp) <= cast(_dateTime as timestamp)) i)
            , 0) as    interest_due
    )
   , penalty_due as
    (
        select _loanId loan_id
             , coalesce(
                    (
                        select coalesce(sum(amount), 0)
                        from events
                        where event_type = 'ACCRUAL_OF_PENALTY'
                          and cast(effective_at as timestamp) <= cast(_dateTime as timestamp))
                    -
                    (
                        select coalesce(sum(paid_penalty), 0)
                        from (
                                 select *
                                 from schedule
                                 where cast(maturity_date as timestamp) <= cast(_dateTime as timestamp)) i)
            , 0) as    penalty_due
    )

select loans.id                                                               loan_id
     , cast(_dateTime as date)                                                calculated_date
     , loans.disbursement_date::timestamp                                     disbursement_date
     , planned_close_date.planned_close_date::timestamp                       planned_close_date
     , close_date.close_date::timestamp                                       close_date
     , application.profile_id                                                 profile_id
     , profiles.name                                                          profile_name
     , profiles.type                                                          profile_type
     , application.loan_product_id                                            loan_product_id
     , loan_products.name                                                     loan_product_name
     , loans.currency_id::bigint                                              loan_products_currency_id
     , loan_products_currencies.name                                          loan_products_currency_name
     , 0::bigint                                                              loan_purpose_id
     -- todo it's mock, relation loan to purpose are absent
     , cast('mock_loan_purpose' as varchar(200))                              loan_purpose_name
     -- todo it's mock, relation loan to purpose are absent
     , loans.created_by_id                                                    loan_officer_id
     , cast(users.first_name as text) || ' ' || cast(users.last_name as text) loan_officer_name
     , branches.id                                                            branch_id
     , branches.name                                                          branch_name
     , cast('mock_address' as text)                                           address
     -- todo address column are absent, may be it should select from custom fields?
     , loans.interest_rate                                                    interest_rate
     , interest_principal.unpaid_interest                                     interest
     , interest_principal.unpaid_principal                                    principal
     , interest_principal.total_interest                                      total_interest
     , olb.olb                                                                olb
     , late_principal.late_principal                                          late_principal
     , late_interest.late_interest                                            late_interest
     , interest_due.interest_due                                              interest_due
     , penalty_due.penalty_due                                                penalty_due
     , late_days.late_days                                                    late_days
     , next_repayment.id::bigint                                              next_repayment_id
from loans
         inner join loan_applications application
                    on (application.id = loans.loan_application_id)
         inner join profiles
                    on (profiles.id = application.profile_id)
         inner join loan_products loan_products
                    on (loan_products.id = application.loan_product_id)
         inner join currencies loan_products_currencies
                    on (loan_products_currencies.id = loans.currency_id)
         inner join users
                    on (loans.created_by_id = users.id)
         inner join branches
                    on (branches.id = users.branch_id)
         inner join planned_close_date
                    on (planned_close_date.loan_id = loans.id)
         left join close_date
                   on (close_date.loan_id = loans.id)
         left join next_repayment
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
where loans.id = _loanId;
$$;

alter function _calculate_analitic_(bigint, timestamp) owner to postgres;

-------------------

create or replace function _calculate_analitic_by_date(_datetime timestamp without time zone) returns void
    language plpgsql
as
$$
begin
    RAISE NOTICE 'Processing date: %', _datetime;

    delete from analytics_active_loans where calculated_date::date = _datetime::date;

    with active_loans as (
        select id
        from loans
        where id not in (
            select loan_id
            from loans_events
            where event_type = 'CLOSED'
              and effective_at <= _datetime
              and deleted is false
        )
          and id in (select loan_id
                     from loans_events
                     where event_type = 'DISBURSEMENT'
                       and effective_at <= _datetime
                       and deleted is false
        )
    )
    insert
    into analytics_active_loans
    (loan_id, calculated_date, disbursement_date, planned_close_date, close_date, profile_id, profile_name,
     profile_type, loan_product_id, loan_product_name, loan_products_currency_id, loan_products_currency_name,
     loan_purpose_id, loan_purpose_name, loan_officer_id, loan_officer_name, branch_id,
     branch_name, address, interest_rate, interest, principal,
     olb, late_principal, late_interest, interest_due, penalty_due,
     late_days, next_repayment_id, total_interest)
    select loan_id,
           calculated_date,
           disbursement_date,
           planned_close_date,
           close_date,
           profile_id,
           profile_name,
           profile_type,
           loan_product_id,
           loan_product_name,
           loan_products_currency_id,
           loan_products_currency_name,
           loan_purpose_id,
           loan_purpose_name,
           loan_officer_id,
           loan_officer_name,
           branch_id,
           branch_name,
           address,
           interest_rate,
           interest,
           principal,
           olb,
           late_principal,
           late_interest,
           interest_due,
           penalty_due,
           late_days,
           next_repayment_id,
           total_interest
    from (
             select active_loans.id
             from active_loans
         ) t,
         lateral _calculate_analitic_(t.id, _datetime) a;
end;
$$;

alter function _calculate_analitic_by_date(timestamp) owner to postgres;