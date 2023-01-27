alter table bonds_product
add column penalty_rate_min decimal(16, 4),
add column penalty_rate_max decimal(16, 4);

update bonds_product
set penalty_rate_min = 1, penalty_rate_max = 100
where id = 1;

alter table bonds add column penalty_rate decimal(16, 4) not null default 0;

update bonds
set penalty_rate = 10
where id = 1;

insert into accounts
(number, name, is_debit, parent_id, start_date, close_date, type, lft, rgt, currency_id, branch_id, validate_off)
values
  ('4002008', 'Bonds Penalty', false , 86, '2000-01-01', null, 3, 0, 0, null, 1, false );

insert into bonds_product_accounts
(type, bonds_product_id, account_id)
values
  ('PENALTY', 1, (select id from accounts where number = '4002008'));

update accounts set parent_id = 86 where number = '4002007';

