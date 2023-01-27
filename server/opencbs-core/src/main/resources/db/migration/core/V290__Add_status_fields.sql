alter table loan_products add column status varchar(10) default 'ACTIVE';
alter table audit.loan_products_history add column status varchar(10) default 'ACTIVE'