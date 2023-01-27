insert into accounts
(number, name, is_debit, parent_id, start_date, close_date, type, lft, rgt, currency_id, branch_id, validate_off, locked, allowed_transfer_from, allowed_transfer_to, allowed_cash_deposit, allowed_cash_withdrawal, allowed_manual_transaction)
select '5005', 'Bank accounts',
       is_debit, id, start_date, close_date, 2, lft, rgt, currency_id, branch_id,
       validate_off, locked, allowed_transfer_from, allowed_transfer_to, allowed_cash_deposit, allowed_cash_withdrawal,
       allowed_manual_transaction
from accounts
where name = 'EXPENSES';

insert into accounts    (number, name, is_debit, parent_id, start_date, close_date, type, lft, rgt, currency_id, branch_id, validate_off, locked, allowed_transfer_from, allowed_transfer_to, allowed_cash_deposit, allowed_cash_withdrawal, allowed_manual_transaction)
select '5005001', 'SEPA accounts',
       is_debit,
       id,
       start_date, close_date,
       3,
       lft, rgt, currency_id, branch_id,
       validate_off, locked, allowed_transfer_from, allowed_transfer_to, allowed_cash_deposit, allowed_cash_withdrawal,
       allowed_manual_transaction
from accounts
where number = '5005';

insert into accounts    (number, name, is_debit, parent_id, start_date, close_date, type, lft, rgt, currency_id, branch_id, validate_off, locked, allowed_transfer_from, allowed_transfer_to, allowed_cash_deposit, allowed_cash_withdrawal, allowed_manual_transaction)
select '50050011', 'SEPA EUR account',
       is_debit,
       id,
       start_date, close_date,
       4,
       lft, rgt, (SELECT id FROM currencies WHERE name = 'EUR'), branch_id,
       validate_off, locked, allowed_transfer_from, allowed_transfer_to, allowed_cash_deposit, allowed_cash_withdrawal,
       allowed_manual_transaction
from accounts
where number = '5005001';
