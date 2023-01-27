insert into accounts (number, name, is_debit, parent_id, start_date, close_date, type, lft, rgt, currency_id, branch_id)
values
  (8000, 'Off-balance accounts', true, null, '2017-01-01 00:00:00.000000', null, 2, 0, 0, 1, 1),
  (8001, 'Off-balance account', true, (select id
                                       from accounts
                                       where number = '8000'), '2017-01-01 00:00:00.000000', null, 4, 0, 0, 1, 1);
select setval('accounts_id_seq', (select max(id)
                                  from accounts));
