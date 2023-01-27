ALTER TABLE borrowing_accounts
  ALTER COLUMN account_id TYPE BIGINT;

ALTER TABLE borrowing_accounts
  ALTER COLUMN borrowing_id TYPE BIGINT;

ALTER TABLE borrowing_events
  ALTER COLUMN created_by_id TYPE BIGINT;

ALTER TABLE borrowing_events
  ALTER COLUMN borrowing_id TYPE BIGINT;

ALTER TABLE borrowing_events
  ALTER COLUMN rolled_back_by_id TYPE BIGINT;

ALTER TABLE borrowing_events_accounting_entries
  ALTER COLUMN borrowing_event_id TYPE BIGINT;

ALTER TABLE borrowing_events_accounting_entries
  ALTER COLUMN accounting_entry_id TYPE BIGINT;

ALTER TABLE borrowing_products
  ALTER COLUMN currency_id TYPE BIGINT;

ALTER TABLE borrowing_products_accounts
  ALTER COLUMN account_id TYPE BIGINT;

ALTER TABLE borrowing_products_accounts
  ALTER COLUMN borrowing_product_id TYPE BIGINT;

ALTER TABLE borrowings
  ALTER COLUMN borrowing_product_id TYPE BIGINT;

ALTER TABLE borrowings
  ALTER COLUMN created_by_id TYPE BIGINT;

ALTER TABLE borrowings
  ALTER COLUMN loan_officer_id TYPE BIGINT;

ALTER TABLE borrowings
  ALTER COLUMN profile_id TYPE BIGINT;

ALTER TABLE borrowings
  ALTER COLUMN correspondence_account_id TYPE BIGINT;

ALTER TABLE borrowings_installments
  ALTER COLUMN event_group_key TYPE BIGINT;

ALTER TABLE borrowings_installments
  ALTER COLUMN borrowing_id TYPE BIGINT;