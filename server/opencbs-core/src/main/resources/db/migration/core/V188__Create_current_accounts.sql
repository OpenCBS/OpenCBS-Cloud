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
values ('2010', 'Current Accounts' , false,
                 (SELECT id FROM accounts WHERE number = '2'),  '2000-01-01', null, 2, 0, 0, null, 1, false);

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
values ('2010001', 'Current Accounts USD' , false,
(SELECT id FROM accounts WHERE number = '2010'),  '2000-01-01', null, 3, 0, 0, 1, 1, false);

UPDATE global_settings set value = '2010' WHERE name = 'DEFAULT_CURRENT_ACCOUNT_GROUP';
