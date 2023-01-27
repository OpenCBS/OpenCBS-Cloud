ALTER TABLE saving_product_accounts
  ALTER COLUMN saving_product_id TYPE BIGINT;

ALTER TABLE saving_product_accounts
  ALTER COLUMN account_id TYPE BIGINT;

ALTER TABLE savings_accounting_entries
  ALTER COLUMN saving_id TYPE BIGINT;

ALTER TABLE savings_accounting_entries
  ALTER COLUMN accounting_entry_id TYPE BIGINT;

ALTER TABLE savings_accounts
  ALTER COLUMN saving_id TYPE BIGINT;

ALTER TABLE savings_accounts
  ALTER COLUMN account_id TYPE BIGINT;

ALTER TABLE savings
    ALTER COLUMN created_by_id TYPE BIGINT;

ALTER TABLE savings
  ALTER COLUMN opened_by_id TYPE BIGINT;

ALTER TABLE savings
    ALTER COLUMN closed_by_id TYPE BIGINT;

ALTER TABLE savings
    ALTER COLUMN reopened_by_id TYPE BIGINT;

ALTER TABLE savings
    ALTER COLUMN deposited_by_id TYPE BIGINT;

ALTER TABLE savings
    ALTER COLUMN withdrawed_by_id TYPE BIGINT;

ALTER TABLE savings
  ALTER COLUMN saving_officer_id TYPE BIGINT;

ALTER TABLE saving_products
  ALTER COLUMN currency_id TYPE BIGINT;

ALTER TABLE savings
  ALTER COLUMN saving_product_id TYPE BIGINT;

ALTER TABLE savings
  ALTER COLUMN profile_id TYPE BIGINT;
