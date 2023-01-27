alter table loan_products
add column maturity_date_max date;

alter table audit.loan_products_history
add column maturity_date_max date;