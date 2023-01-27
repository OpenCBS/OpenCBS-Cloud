insert into accounts
(number, name, is_debit, parent_id, start_date, close_date, type, lft, rgt, currency_id, branch_id, validate_off)
values
  ('2001001', 'Bond Principal', false ,47, '2000-01-01', null, 3, 0, 0, null, 1, false),
  ('2003005', 'Bond Accrued Interest', false , 49, '2000-01-01', null, 3, 0, 0, null, 1, false ),
  ('5004018', 'Bond Accrued Expense', true , 107, '2000-01-01', null, 3, 0, 0, null, 1, false ),
  ('4002007', 'Bond Commission Income', false , 49, '2000-01-01', null, 3, 0, 0, null, 1, false );

insert into bonds_product_accounts
(type, bonds_product_id, account_id)
values
  ('PRINCIPAL', 1, (select id from accounts where number = '2001001')),
  ('INTEREST_ACCRUAL', 1, (select id from accounts where number = '2003005')),
  ('INTEREST_EXPENSE', 1, (select id from accounts where number = '5004018')),
  ('INCOME_COMMISSION', 1, (select id from accounts where number = '4002007'));