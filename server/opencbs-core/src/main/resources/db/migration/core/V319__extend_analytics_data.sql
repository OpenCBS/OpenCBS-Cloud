------------------------------------------------------------------------------------------------------------------------
------- CREATE OR REPLACE SERVICE FUNCTION
------------------------------------------------------------------------------------------------------------------------
create or replace function get_in_cash_recursive(bigint, date, date) returns numeric
    language sql
as $$
with recursive tree as (
    select a.* from accounts a where id = $1
    union all
    select a.* from accounts a
                        join tree t on t.id = a.parent_id
)
select
    case
        when a.is_debit
            then coalesce(
                (
                    select
                        sum(ae.amount)
                    from
                        accounting_entries ae
                    where
                            ae.debit_account_id in (select tree.id from tree)
                      and ae.effective_at >= $2 and ae.effective_at<$3 and deleted = false
                )
            ,0)
        else
            coalesce(
                    (select
                         sum(ae.amount)
                     from accounting_entries ae
                     where ae.credit_account_id in (select tree.id from tree)
                       and ae.effective_at >= $2 and ae.effective_at<$3 and deleted = false
                    )
                ,0)
        end
from accounts a where a.id = $1;
$$;
alter function get_in_cash_recursive(bigint, date, date) owner to postgres;

create or replace function get_out_cash_recursive(bigint, date, date) returns numeric
    language sql
as $$
with recursive tree as (
    select a.* from accounts a where id = $1
    union all
    select a.* from accounts a
                        join tree t on t.id = a.parent_id
)
select
    case
        when not a.is_debit
            then coalesce(
                (
                    select
                        sum(ae.amount)
                    from
                        accounting_entries ae
                    where
                            ae.debit_account_id in (select tree.id from tree)
                      and ae.effective_at >= $2 and ae.effective_at<$3 and deleted = false
                )
            ,0)
        else
            coalesce(
                    (select
                         sum(ae.amount)
                     from accounting_entries ae
                     where ae.credit_account_id in (select tree.id from tree)
                       and ae.effective_at >= $2 and ae.effective_at<$3 and deleted = false
                    )
                ,0)
        end
from accounts a where a.id = $1;
$$;
alter function get_out_cash_recursive(bigint, date, date) owner to postgres;

------------------------------------------------------------------------------------------------------------------------
------- EXTENDS ANALYTICS
------------------------------------------------------------------------------------------------------------------------
create schema if not exists analytics;
create table if not exists analytics.in_out_flow_amounts (
                                               account_id bigint not null,
                                               in_cash numeric(14, 2),
                                               out_cash numeric(14, 2),
                                               date date
);
create index in_out_flow_amounts_account_id_date_index
    on analytics.in_out_flow_amounts (account_id, date);
create index in_out_flow_amounts_account_id_index
    on analytics.in_out_flow_amounts (account_id);
create index in_out_flow_amounts_date_index
    on analytics.in_out_flow_amounts (date);

------------------------------------------------------------------------------------------------------------------------
------- UPDATE OR CREATE INFORMATION ABOUT IN/OUT CASH FLOW TO DATE BY ALL ACCOUNTS
------- USE FROM DAY CLOSURE PROCESS
------------------------------------------------------------------------------------------------------------------------
create or replace function update_in_out_cash_flow(date) returns void
    language plpgsql
as
$$
declare
    _date alias for $1;
    _end_date date;
begin
    select _date + interval '1 days' into _end_date;

    RAISE NOTICE 'upgrade date:%', _date;

    delete from analytics.in_out_flow_amounts where date = _date;
    insert into analytics.in_out_flow_amounts(account_id, in_cash, out_cash, date)
    select t.id, t.in, t.out, _date
    from (
             with debit as (
                 select debit_account_id account_id, sum(amount) amount
                 from accounting_entries ae
                 where ae.effective_at >= _date and ae.effective_at < _end_date and deleted = false
                 group by debit_account_id
             ),
                  credit as (
                      select credit_account_id account_id, sum(amount) amount
                      from accounting_entries ae
                      where ae.effective_at >= _date and ae.effective_at < _end_date and deleted = false
                      group by credit_account_id
                  )
             select a.id, a.number,
                    case
                        when a.is_debit
                            then
                            debit.amount
                        else
                            credit.amount
                        end "in",
                    case
                        when a.is_debit
                            then
                            credit.amount
                        else
                            debit.amount
                        end "out"
             from accounts a
                      left join debit on a.id = debit.account_id
                      left join credit on a.id = credit.account_id
             where a.type = 4
         ) t;

    insert into analytics.in_out_flow_amounts(account_id, in_cash, out_cash, date)
    select t.account_id, t.in, t.out, _date
    from (
             with accounts as (
                 select * from accounts where type < 4
             )
             select a.id account_id,
                    get_in_cash_recursive(a.id, _date, _end_date) as "in",
                    get_out_cash_recursive(a.id, _date, _end_date) as "out"
             from accounts a
         ) t;
end
$$;