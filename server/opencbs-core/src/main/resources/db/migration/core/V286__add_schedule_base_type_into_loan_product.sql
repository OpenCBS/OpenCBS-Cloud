alter table loan_products add column schedule_based_type varchar(50);
update loan_products set schedule_based_type = 'BY_INSTALLMENT';
alter table loan_products alter column schedule_based_type set not null;

alter table audit.loan_products_history add column  schedule_based_type varchar(50);

alter table loan_applications add column maturity_date date;
alter table loans add column maturity_date date;