create or replace function xirr_from_schedule(_loan_id bigint, _date timestamp without time zone) returns numeric
    language plpgsql
as
$$
declare
cash_flows   numeric[];
    date_flows   timestamp[];
    l_threshold  numeric     := 0.001;
    l_guess      numeric     := l_threshold + 1;
    l_next_guess numeric     := 0;
    l_irr        numeric     := 0.1;
    npv          numeric     := 0;
    summ         numeric     := 0;
    date_part    numeric     :=0;
begin

select array_agg(amount), array_agg(effective_at)
from (
         select *
         from (select -amount as amount,
                      effective_at
               from loans_events le
               where le.event_type = 'DISBURSEMENT'
                 and le.loan_id = _loan_id
                     and le.deleted is false
                     and le.effective_at::date <= _date::date
               union
               select amount as amount,
                   effective_at
               from loans_events le
               where le.event_type = 'ENTRY_FEE_DISBURSEMENT'
                 and le.loan_id = _loan_id
                 and le.deleted is false
                 and le.effective_at::date <= _date::date
               union
               select sh.interest + sh.principal as amount,
                   maturity_date
               from get_loan_schedule(_loan_id, _date::timestamp) sh) t
         order by effective_at
     ) t into cash_flows, date_flows;

select sum(t) from unnest(cash_flows) t into summ;
if summ is null or summ <= 0 then
        cash_flows := null;
        date_flows := null;
return -0;
end if;

    while abs(l_guess) > l_threshold
        loop
            l_guess := 0;
            l_next_guess := 0;
for i in 1 .. array_upper(cash_flows, 1)
                loop
                    date_part = DATE_PART('day', date_flows[i] - date_flows[1]) / 365;
                    npv = cash_flows[i] / power(1 + l_irr, date_part);
                    l_guess := l_guess + npv;
                    l_next_guess := l_next_guess - date_part * npv / (1 + l_irr);
end loop;
            l_irr := l_irr - l_guess / l_next_guess;
end loop;
    cash_flows := null;
    date_flows := null;
return l_irr;
END
$$;

alter function xirr_from_schedule(bigint, timestamp) owner to postgres;

