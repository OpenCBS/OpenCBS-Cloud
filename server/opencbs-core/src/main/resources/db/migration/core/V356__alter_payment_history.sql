alter table if exists import_payment_history
    rename column contract_number to technical_account_number;

alter table if exists import_payment_history
    drop column if exists is_uploaded;

alter table if exists import_payment_history ADD COLUMN uploading_date timestamp;