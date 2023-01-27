insert into accounts (number, "name", is_debit, parent_id, start_date, close_date, "type", lft, rgt, currency_id)
values
  ('2060', 'Additional fees', true, 1, '2017-01-01', null, 2, 0, 0, null),
  ('2061', 'Charged other fees', true, (select id
                                         from accounts
                                         where number = '2060'), '2017-01-01', null, 2, 0, 0, null);
select setval('accounts_id_seq', (select max(id)
                                  from accounts));
end;
