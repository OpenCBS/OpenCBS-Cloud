
insert into accounts (
  number,
  name,
  is_debit,
  parent_id,
  start_date,
  close_date,
  type,
  lft,
  rgt,
  currency_id,
  branch_id,
  off_balance)
values
  ('4001002000001', 'Admin Fee' ,        true, (SELECT id FROM accounts WHERE name = 'Service Fees'),  '2000-01-01', null, 4, 0, 0, 1, 1, false),
  ('4001002000002', 'Training Fee' ,     true, (SELECT id FROM accounts WHERE name = 'Service Fees'),  '2000-01-01', null, 4, 0, 0, 1, 1, false),
  ('4001002000003', 'Accounting fee' ,   true, (SELECT id FROM accounts WHERE name = 'Service Fees'),  '2000-01-01', null, 4, 0, 0, 1, 1, false),
  ('4001002000004', 'Bill of sale fee' , true, (SELECT id FROM accounts WHERE name = 'Service Fees'),  '2000-01-01', null, 4, 0, 0, 1, 1, false),
  ('4001002000005', 'Insurance fee' ,    true, (SELECT id FROM accounts WHERE name = 'Service Fees'),  '2000-01-01', null, 4, 0, 0, 1, 1, false),
  ('4001002000006', 'Legal fee' ,        true, (SELECT id FROM accounts WHERE name = 'Service Fees'),  '2000-01-01', null, 4, 0, 0, 1, 1, false),
  ('4001002000007', 'GrantAmt fee' ,     true, (SELECT id FROM accounts WHERE name = 'Service Fees'),  '2000-01-01', null, 4, 0, 0, 1, 1, false),
  ('4001002000008', 'Registration fee' , true, (SELECT id FROM accounts WHERE name = 'Service Fees'),  '2000-01-01', null, 4, 0, 0, 1, 1, false),
  ('4001002000009', 'Other fee' ,        true, (SELECT id FROM accounts WHERE name = 'Service Fees'),  '2000-01-01', null, 4, 0, 0, 1, 1, false);
