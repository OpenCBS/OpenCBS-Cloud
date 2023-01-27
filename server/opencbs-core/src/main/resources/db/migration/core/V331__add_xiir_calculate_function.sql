create or replace function xirr(_loan_id bigint, _date timestamp)
    returns numeric as
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
             select
                 case when event_type = 'DISBURSEMENT' then -amount else amount end amount,
                 effective_at
             from loans_events
             where loan_id = _loan_id
               and deleted is false
               and event_type in ('REPAYMENT_OF_PRINCIPAL', 'REPAYMENT_OF_INTEREST', 'DISBURSEMENT')
               and effective_at::date<=_date::date
             order by effective_at
         ) t into cash_flows, date_flows;

    select sum(t) from unnest(cash_flows) t into summ;
    if summ <= 0 then
        cash_flows := null;
        date_flows := null;
        return 0;
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
$$ LANGUAGE plpgsql;