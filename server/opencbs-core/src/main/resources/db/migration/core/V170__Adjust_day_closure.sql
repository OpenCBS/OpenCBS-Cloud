alter table end_of_days rename to day_closures;
alter table day_closures add column id bigserial primary key;
