insert into accounts
(number, name, is_debit, parent_id, start_date, close_date, type, lft, rgt, currency_id, branch_id)
    values
    ('4001002001', 'Disbursement Fee', false, 83, '2000-01-01', null, 4, 0, 0, 1, 1),
    ('1005004', 'Accrued Penalty Receivable', true , 10, '2000-01-01', null, 3, 0, 0, null , 1),
    ('7001002', 'Write Off Principal', true , 154, '2000-01-01', null, 3, 0, 0, null , 1),
    ('7001003', 'Write Off Interest', true , 154, '2000-01-01', null, 3, 0, 0, null , 1),
    ('7001004', 'Write Off Penalty', true , 154, '2000-01-01', null, 3, 0, 0, null , 1),
    ('2001002', 'Borrowing Principal', false, 47, '2000-01-01', null, 3, 0, 0, null, 1),
    ('2001003', 'Borrowing Interest', false, 47, '2000-01-01', null, 3, 0, 0, null, 1),
    ('2002001', 'Savings', false , 48, '2000-01-01', null, 3, 0, 0, null , 1),
    ('2002002', 'Saving Interest', false , 48, '2000-01-01', null, 3, 0, 0, null , 1),
    ('5001004', 'Interest Expense On Savings', false , 94, '2000-01-01', null, 3, 0, 0, null , 1),
    ('1015', 'Savings and Receivable', true , 1, '2000-01-01', null, 2, 0, 0, null , 1),
    ('4003', 'Income from Deposit Operations', false , 73, '2000-01-01', null, 2, 0, 0, null , 1),
    ('2002003', 'Term Deposit Principal', false , 48, '2000-01-01', null, 3, 0, 0, null , 1),
    ('2002004', 'Term Deposit Interest', false , 48, '2000-01-01', null, 3, 0, 0, null , 1),
    ('1016', 'Vault', true , 1, '2000-01-01', null, 2, 0, 0, null , 1),
    ('1017', 'Till', true , 1, '2000-01-01', null, 2, 0, 0, null , 1),
    ('1002004001', 'Correspondence', true , 7, '2000-01-01', null, 4, 0, 0, 1 , 1);

insert into accounts
(number, name, is_debit, parent_id, start_date, close_date, type, lft, rgt, currency_id, branch_id)
    values
    ('1015001', 'Deposit/Withdrawal Fee', true , (select id from accounts where number = '1015'), '2000-01-01', null, 3, 0, 0, null , 1),
    ('4003001', 'Deposit/Withdrawal Fee', false , (select id from accounts where number = '4003'), '2000-01-01', null, 3, 0, 0, null , 1),
    ('1015002', 'Management Fee', true , (select id from accounts where number = '1015'), '2000-01-01', null, 3, 0, 0, null , 1),
    ('4003002', 'Management Fee', false , (select id from accounts where number = '4003'), '2000-01-01', null, 3, 0, 0, null , 1),
    ('4003003', 'Entry Fee', false , (select id from accounts where number = '4003'), '2000-01-01', null, 3, 0, 0, null , 1),
    ('1015003', 'Entry Fee', true , (select id from accounts where number = '1015'), '2000-01-01', null, 3, 0, 0, null , 1),
    ('4003004', 'Close Fee', false , (select id from accounts where number = '4003'), '2000-01-01', null, 3, 0, 0, null , 1),
    ('1015004', 'Close Fee', true , (select id from accounts where number = '1015'), '2000-01-01', null, 3, 0, 0, null , 1),
    ('4003005', 'Deposit Interest Write Off', false , (select id from accounts where number = '4003'), '2000-01-01', null, 3, 0, 0, null , 1),
    ('1015005', 'Early Close Fee', true , (select id from accounts where number = '1015'), '2000-01-01', null, 3, 0, 0, null , 1),
    ('1016001', 'Main Branch Vault', true , (select id from accounts where number = '1016'), '2000-01-01', null, 3, 0, 0, null , 1),
    ('1017001', 'Main Branch Till', true , (select id from accounts where number = '1017'), '2000-01-01', null, 3, 0, 0, null , 1);

insert into accounts
(number, name, is_debit, parent_id, start_date, close_date, type, lft, rgt, currency_id, branch_id)
    values
    ('1016001001', 'New York Branch Vault', true , (select id from accounts where number = '1016001'), '2000-01-01', null, 4, 0, 0, 1 , 1),
    ('1017001001', 'New York Branch Till', true , (select id from accounts where number = '1017001'), '2000-01-01', null, 4, 0, 0, 1 , 1);

insert into accounts_account_tags
(account_id, account_tag_id)
    values
    ((select id from accounts where number = '1005004'), 1),
    ((select id from accounts where number = '7001002'), 7),
    ((select id from accounts where number = '7001003'), 7),
    ((select id from accounts where number = '7001004'), 7),
    ((select id from accounts where number = '2001003'), 2),
    ((select id from accounts where number = '2002001'), 2),
    ((select id from accounts where number = '2002002'), 2),
    ((select id from accounts where number = '5001004'), 6),
    ((select id from accounts where number = '1015'), 1),
    ((select id from accounts where number = '1015001'), 1),
    ((select id from accounts where number = '1015002'), 1),
    ((select id from accounts where number = '1015003'), 1),
    ((select id from accounts where number = '1015004'), 1),
    ((select id from accounts where number = '1016'), 1),
    ((select id from accounts where number = '1017'), 1),
    ((select id from accounts where number = '1016001'), 1),
    ((select id from accounts where number = '1016001001'), 1),
    ((select id from accounts where number = '1017001'), 1),
    ((select id from accounts where number = '1017001001'), 1),
    ((select id from accounts where number = '2002003'), 2),
    ((select id from accounts where number = '2002004'), 2),
    ((select id from accounts where number = '1015005'), 1),
    ((select id from accounts where number = '1002004001'), 1),
    ((select id from accounts where number = '2001002'), 2);