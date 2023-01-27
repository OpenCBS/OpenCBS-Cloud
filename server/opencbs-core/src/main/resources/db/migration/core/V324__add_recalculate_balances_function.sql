create or replace function _recalculate_balance(timestamp without time zone) RETURNS void AS $$
declare
    _date_time ALIAS FOR $1;
begin
    RAISE NOTICE 'Recalculate date: %', _date_time;
    drop table if exists etalon_balances;
    create table etalon_balances as (
        select a.id account_id, b balance from accounts a,
                                               lateral get_balance( a.id, _date_time ) b
    );
    create index etalon_balances_account_index on etalon_balances(account_id);

    FOR _type IN REverse 3..1 LOOP
            RAISE NOTICE 'Counter: %', _type;
            with s as (
                select t.account, t.balance from (
                                                     with v as (
                                                         select c.*, a.parent_id, a.type from accounts a
                                                                                                  left join etalon_balances c  on a.id = c.account_id
                                                     )
                                                     select sum(v.balance) balance, v.parent_id as account
                                                     from v
                                                     group by v.parent_id
                                                 ) t join accounts a on a.id = t.account
            )
            update etalon_balances
            set balance = (select balance from s where account = account_id)
            where account_id in (select id from accounts where type=_type);
        END LOOP;

    delete from account_balances where date::date = _date_time::date;
    insert into account_balances(account_id, balance, date)
    select t.account_id, coalesce(t.balance,0), _date_time from etalon_balances t;
    drop table if exists etalon_balances;
    delete from accounting_entries_logs where effective_date::date = _date_time::date;
end;
$$
LANGUAGE plpgsql;