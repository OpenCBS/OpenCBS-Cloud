insert into accounts (number, "name", is_debit, parent_id, start_date, close_date, "type", lft, rgt)
values ('1000', 'Assets', true, null, '2017-01-01', null, 1, 0, 0),
  ('1100', 'Cash', true, 1, '2017-01-01', null, 2, 0, 0),
  ('1101', 'Till', true, 2, '2017-01-01', null, 4, 0, 0),
  ('1102', 'Vault', true, 2, '2017-01-01', null, 4, 0, 0);