-- noinspection SqlNoDataSourceInspectionForFile
create function get_balance(integer, timestamp)
  returns numeric
  language sql
as $$
select
  case
    when a.is_debit then coalesce(end_debit.amount, 0) - coalesce(end_credit.amount, 0)
    else coalesce(end_credit.amount, 0) - coalesce(end_debit.amount, 0)
  end
from
  accounts a
left join (
  select
    debit_account_id account_id
    , sum(coalesce(ae.amount, 0)) amount
  from
    accounting_entries ae
  where
    ae.created_at <= $2
  group by
    debit_account_id
) end_debit on end_debit.account_id = a.id
left join (
  select
    credit_account_id  account_id
    , sum(coalesce(ae.amount, 0)) amount
  from
    accounting_entries ae
  where
    ae.created_at <= $2
  group by
    credit_account_id
) end_credit on end_credit.account_id = a.id
where
  a.id = $1
$$;
