alter table bonds add column sell_date date;
alter table bonds alter column value_date drop not null;