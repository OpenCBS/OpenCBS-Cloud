update accounts
set is_debit = true
where number = '50001';

alter table accounting_entries add column
effective_at timestamp without time zone;

insert into accounts (number, name, is_debit, parent_id, start_date, close_date,
                      type, lft, rgt, currency_id, branch_id, validate_off,
                      locked, allowed_transfer_from, allowed_transfer_to,
                      allowed_cash_deposit, allowed_cash_withdrawal, allowed_manual_transaction)
values
  ('40020001', 'Gain account', false, 86, now(), null, 4, 0, 0, 1, 1, false, false, false, false, false, false, false),
  ('50001', 'Loss account', false, 93, now(), null, 4, 0, 0, 1, 1, false, false, false, false, false, false, false);
select setval('accounts_id_seq', (select max(id) from accounts));

insert into global_settings (name, type, value)
values
  ('GAIN_ACCOUNT', 'STRING', '40020001'),
  ('LOSS_ACCOUNT', 'STRING', '50001');