insert into accounts(number, name, is_debit, parent_id, start_date, close_date, type, lft, rgt, currency_id)
values ('101101', 'Cash or other payment channels'    , false, (select id from accounts where number = '1011')  , '2017-01-01', null, 3, null, null, 1);

insert into accounts(number, name, is_debit, parent_id, start_date, close_date, type, lft, rgt, currency_id)
values ('10110101', 'Cash or other payment channels'    , false, (select id from accounts where number = '101101')  , '2017-01-01', null, 4, null, null, 1);
