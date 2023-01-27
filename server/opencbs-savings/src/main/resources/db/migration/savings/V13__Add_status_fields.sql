alter table saving_products add column status varchar(10) default 'ACTIVE';
alter table audit.saving_products_history add column status varchar(10) default 'ACTIVE'