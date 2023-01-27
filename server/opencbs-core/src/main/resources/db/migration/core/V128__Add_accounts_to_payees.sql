create table payees_accounts (
  id         bigserial primary key,
  payee_id int not null,
  account_id int not null
);
alter table payees_accounts
  add constraint payees_accounts_payee_id_fkey foreign key (payee_id) references payees (id);
alter table payees_accounts
  add constraint payees_accounts_account_id_fkey foreign key (account_id) references accounts (id);

insert into accounts (number, "name", is_debit, parent_id, start_date, close_date, "type", lft, rgt, currency_id)
values
  ('3012', 'Payees Current accounts'		, false, 21,   '2017-01-01', null, 2, 0, 0, null);
insert into accounts (number, "name", is_debit, parent_id, start_date, close_date, "type", lft, rgt, currency_id)
values
  ('3013', 'Payees Current Accounts USD'	, false, (select id from accounts where number = '3012'), '2017-01-01', null, 4, 0, 0, 1);
insert into accounts (number, "name", is_debit, parent_id, start_date, close_date, "type", lft, rgt, currency_id)
values
  ('30130010013010001000001', 'Account for payee'	, false, (select id from accounts where number = '3013'),   '2017-01-01', null, 5, 0, 0, 1),
  ('30130010013010001000002', 'Account for payee'	, false, (select id from accounts where number = '3013'),   '2017-01-01', null, 5, 0, 0, 1),
  ('30130010013010001000003', 'Account for payee'	, false, (select id from accounts where number = '3013'),   '2017-01-01', null, 5, 0, 0, 1),
  ('30130010013010001000004', 'Account for payee'	, false, (select id from accounts where number = '3013'),   '2017-01-01', null, 5, 0, 0, 1),
  ('30130010013010001000005', 'Account for payee'	, false, (select id from accounts where number = '3013'),   '2017-01-01', null, 5, 0, 0, 1);

select setval('accounts_id_seq', (select max(id) from accounts));
end;
