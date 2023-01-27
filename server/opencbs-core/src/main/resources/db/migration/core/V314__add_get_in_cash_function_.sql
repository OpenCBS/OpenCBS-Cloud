create or replace function get_in_cash(bigint, date, date) returns numeric
    language sql
as $$
select case
           when a.is_debit
               then coalesce(debit.amount, 0)
           else coalesce(credit.amount, 0)
           end
from
    accounts a
        left join
    (
        select
            debit_account_id            account_id,
            sum(coalesce(ae.amount, 0)) amount
        from
            accounting_entries ae
        where
                ae.effective_at >= $2 and ae.effective_at < $3 and ae.deleted = false
        group by
            debit_account_id
    )
        debit on debit.account_id = a.id
        left join
    (
        select
            credit_account_id           account_id,
            sum(coalesce(ae.amount, 0)) amount
        from
            accounting_entries ae
        where
                ae.effective_at >= $2 and ae.effective_at < $3 and ae.deleted = false
        group by
            credit_account_id
    )
        credit on credit.account_id = a.id
where
        a.id = $1
$$;

alter function get_in_cash(bigint, date, date) owner to postgres;

create or replace function get_out_cash(bigint, date, date) returns numeric
    language sql
as $$
select case
           when a.is_debit
               then coalesce(credit.amount, 0)
           else coalesce(debit.amount, 0)
           end
from
    accounts a
        left join
    (
        select
            debit_account_id            account_id,
            sum(coalesce(ae.amount, 0)) amount
        from
            accounting_entries ae
        where
                ae.effective_at >= $2 and ae.effective_at < $3 and ae.deleted = false
        group by
            debit_account_id
    )
        debit on debit.account_id = a.id
        left join
    (
        select
            credit_account_id           account_id,
            sum(coalesce(ae.amount, 0)) amount
        from
            accounting_entries ae
        where
                ae.effective_at >= $2 and ae.effective_at < $3 and ae.deleted = false
        group by
            credit_account_id
    )
        credit on credit.account_id = a.id
where
        a.id = $1
$$;

alter function get_out_cash(bigint, date, date) owner to postgres;


