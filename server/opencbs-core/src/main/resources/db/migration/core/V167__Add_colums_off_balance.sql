alter table accounts
  add column off_balance boolean not null default false;

update accounts
  set off_balance = true
where number = '8001';