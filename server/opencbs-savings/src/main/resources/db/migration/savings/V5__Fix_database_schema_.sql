alter table saving_product_accounts alter column account_id type bigint;
alter table saving_product_accounts alter column saving_product_id type bigint;

alter table saving_products alter column currency_id type bigint;

alter table savings alter column profile_id type bigint;
alter table savings alter column saving_product_id type bigint;
alter table savings alter column created_by_id type bigint;
alter table savings alter column opened_by_id type bigint;
alter table savings alter column closed_by_id type bigint;
alter table savings alter column reopened_by_id type bigint;
alter table savings alter column deposited_by_id type bigint;
alter table savings alter column withdrawed_by_id type bigint;
alter table savings alter column saving_officer_id type bigint;

alter table savings_accounting_entries alter column saving_id type bigint;
alter table savings_accounting_entries alter column accounting_entry_id type bigint;

alter table savings_accounts alter column saving_id type bigint;
alter table savings_accounts alter column account_id type bigint;


