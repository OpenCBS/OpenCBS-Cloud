--============================
-- Drop dependencies view
-- ===========================
DROP VIEW IF EXISTS searchable_profiles;

--============================
-- Fix database structure
-- ===========================
ALTER TABLE account_balances
  ALTER COLUMN account_id TYPE BIGINT;

ALTER TABLE accounting_entries
  ALTER COLUMN branch_id TYPE BIGINT;

ALTER TABLE accounting_entries
  ALTER COLUMN created_by_id TYPE BIGINT;

ALTER TABLE accounting_entries
  ALTER COLUMN event_id TYPE BIGINT;

ALTER TABLE accounting_entries
  ALTER COLUMN branch_id TYPE BIGINT;

ALTER TABLE accounts
  ALTER COLUMN branch_id TYPE BIGINT;

ALTER TABLE accounts
  ALTER COLUMN currency_id TYPE BIGINT;

ALTER TABLE accounts
  ALTER COLUMN parent_id TYPE BIGINT;

ALTER TABLE analytics_active_loans
  ALTER COLUMN calculated_date TYPE TIMESTAMP;

ALTER TABLE analytics_active_loans
  ALTER COLUMN disbursement_date TYPE TIMESTAMP;

ALTER TABLE analytics_active_loans
  ALTER COLUMN loan_officer_id TYPE BIGINT;

ALTER TABLE analytics_active_loans
  ALTER COLUMN loan_product_id TYPE BIGINT;

ALTER TABLE analytics_active_loans
  ALTER COLUMN loan_products_currency_id TYPE BIGINT;

ALTER TABLE analytics_active_loans
  ALTER COLUMN loan_purpose_id TYPE BIGINT;

ALTER TABLE analytics_active_loans
  ALTER COLUMN planned_close_date TYPE TIMESTAMP;

ALTER TABLE analytics_active_loans
  ALTER COLUMN profile_id TYPE BIGINT;

ALTER TABLE business_sectors
  ALTER COLUMN parent_id TYPE BIGINT;

ALTER TABLE collaterals
    ALTER COLUMN loan_application_id TYPE BIGINT;

ALTER TABLE collaterals
  ALTER COLUMN type_of_collateral_id TYPE BIGINT;

ALTER TABLE collaterals_custom_fields_values
  ALTER COLUMN created_by_id TYPE BIGINT;

ALTER TABLE collaterals_custom_fields_values
  ALTER COLUMN verified_by_id TYPE BIGINT;

ALTER TABLE companies_custom_fields_values
  ALTER COLUMN created_by_id TYPE BIGINT;

ALTER TABLE companies_custom_fields_values
  ALTER COLUMN verified_by_id TYPE BIGINT;

ALTER TABLE credit_committee_amount_range
 ALTER COLUMN created_by_id TYPE BIGINT;

ALTER TABLE credit_committee_roles
  ALTER COLUMN credit_committee_amount_range_id TYPE BIGINT;

ALTER TABLE credit_committee_roles
  ALTER COLUMN role_id TYPE BIGINT;

ALTER TABLE credit_committee_votes
    ALTER COLUMN changed_by_id TYPE BIGINT;

ALTER TABLE credit_committee_votes
  ALTER COLUMN loan_application_id TYPE BIGINT;

ALTER TABLE credit_committee_votes
  ALTER COLUMN role_id TYPE BIGINT;

ALTER TABLE  credit_committee_votes_history
  ALTER COLUMN changed_by_id TYPE BIGINT;

ALTER TABLE  credit_committee_votes_history
  ALTER COLUMN loan_application_id TYPE BIGINT;

ALTER TABLE  credit_committee_votes_history
  ALTER COLUMN role_id TYPE BIGINT;

ALTER TABLE  entry_fees
  ALTER COLUMN account_id TYPE BIGINT;

ALTER TABLE  exchange_rates
  ALTER COLUMN from_currency_id TYPE BIGINT;

ALTER TABLE  exchange_rates
  ALTER COLUMN to_currency_id TYPE BIGINT;

ALTER TABLE groups_custom_fields_values
  ALTER COLUMN created_by_id TYPE BIGINT;

ALTER TABLE groups_custom_fields_values
  ALTER COLUMN verified_by_id TYPE BIGINT;

ALTER TABLE groups_members
  ALTER COLUMN group_id TYPE BIGINT;

ALTER TABLE groups_members
  ALTER COLUMN member_id TYPE BIGINT;

ALTER TABLE guarantors
  ALTER COLUMN loan_application_id TYPE BIGINT;

ALTER TABLE guarantors
  ALTER COLUMN profile_id TYPE BIGINT;

ALTER TABLE guarantors
  ALTER COLUMN relationship_id TYPE BIGINT;

ALTER TABLE loan_accounts
  ALTER COLUMN account_id TYPE BIGINT;

ALTER TABLE loan_accounts
  ALTER COLUMN loan_id TYPE BIGINT;

ALTER TABLE loan_application_custom_fields_values
  ALTER COLUMN created_by_id TYPE BIGINT;

ALTER TABLE loan_application_custom_fields_values
  ALTER COLUMN verified_by_id TYPE BIGINT;

ALTER TABLE loan_applications
  ALTER COLUMN created_by_id TYPE BIGINT;

ALTER TABLE loan_applications
  ALTER COLUMN loan_officer_id TYPE BIGINT;

ALTER TABLE loan_applications
  ALTER COLUMN loan_product_id TYPE BIGINT;

ALTER TABLE loan_applications
  ALTER COLUMN profile_id TYPE BIGINT;

ALTER TABLE loan_applications_entry_fees
  ALTER COLUMN entry_fee_id TYPE BIGINT;

ALTER TABLE loan_applications_entry_fees
  ALTER COLUMN loan_application_id TYPE BIGINT;

ALTER TABLE loan_applications_installments
  ALTER COLUMN number TYPE BIGINT;

ALTER TABLE loan_applications_installments
  ALTER COLUMN loan_application_id TYPE BIGINT;

ALTER TABLE loan_products
  ALTER COLUMN currency_id TYPE BIGINT;

ALTER TABLE loan_applications_payees
  ALTER COLUMN loan_application_id TYPE BIGINT;

ALTER TABLE  loan_applications_payees
  ALTER COLUMN payee_id TYPE BIGINT;

ALTER TABLE  loan_products_accounts
  ALTER COLUMN account_id TYPE BIGINT;

ALTER TABLE  loan_products_accounts
  ALTER COLUMN loan_product_id TYPE BIGINT;

ALTER TABLE  loan_products_entry_fees
  ALTER COLUMN loan_product_id TYPE BIGINT;

ALTER TABLE  loan_products_entry_fees
  ALTER COLUMN entry_fee_id TYPE BIGINT;

ALTER TABLE loan_purposes
  ALTER COLUMN parent_id TYPE BIGINT;

ALTER TABLE loans
  ALTER COLUMN created_by_id TYPE BIGINT;

ALTER TABLE loans
  ALTER COLUMN loan_application_id TYPE BIGINT;

ALTER TABLE loans
  ALTER COLUMN loan_officer_id TYPE BIGINT;

ALTER TABLE loans_events
  ALTER COLUMN loan_id TYPE BIGINT;

ALTER TABLE loans_events
  ALTER COLUMN created_by_id TYPE BIGINT;

ALTER TABLE loans_events
  ALTER COLUMN rolled_back_by_id TYPE BIGINT;

ALTER TABLE loans_events
  ALTER COLUMN other_fee_id TYPE BIGINT;

ALTER TABLE loans_history
  ALTER COLUMN loan_id TYPE BIGINT;

ALTER TABLE loans_history
  ALTER COLUMN event_id TYPE BIGINT;

ALTER TABLE loans_installments
  ALTER COLUMN event_group_key TYPE BIGINT;

ALTER TABLE loans_installments
    ADD COLUMN accrual_start_date DATE,
    ADD COLUMN accrued_interest NUMERIC (12,2),
    ADD COLUMN paid_penalty NUMERIC (12,2),
    ADD COLUMN penalty NUMERIC (12,2),
    ADD COLUMN start_date DATE;

ALTER TABLE locations
  ALTER COLUMN parent_id TYPE BIGINT;

ALTER TABLE locations
  ALTER COLUMN parent_id TYPE BIGINT;

ALTER TABLE other_fees
  ALTER COLUMN created_by_id TYPE BIGINT;

ALTER TABLE other_fees
  ALTER COLUMN charge_account_id TYPE BIGINT;

ALTER TABLE other_fees
  ALTER COLUMN expense_account_id TYPE BIGINT;

ALTER TABLE other_fees
  ALTER COLUMN income_account_id TYPE BIGINT;

ALTER TABLE payees_accounts
  ALTER COLUMN payee_id TYPE BIGINT;

ALTER TABLE payees_accounts
  ALTER COLUMN account_id TYPE BIGINT;

ALTER TABLE people_custom_fields_values
  ALTER COLUMN created_by_id TYPE BIGINT;

ALTER TABLE people_custom_fields_values
  ALTER COLUMN verified_by_id TYPE BIGINT;

ALTER TABLE professions
  ALTER COLUMN parent_id TYPE BIGINT;

ALTER TABLE profiles
  ALTER COLUMN branch_id TYPE BIGINT;

ALTER TABLE profiles_accounts
  ALTER COLUMN profile_id TYPE BIGINT;

ALTER TABLE profiles_accounts
  ALTER COLUMN account_id TYPE BIGINT;

ALTER TABLE roles_permissions
  ALTER COLUMN id TYPE BIGINT;

ALTER TABLE roles_permissions
  ALTER COLUMN permission_id TYPE BIGINT;

ALTER TABLE roles_permissions
  ALTER COLUMN role_id TYPE BIGINT;

ALTER TABLE task_events
  ALTER COLUMN created_by TYPE BIGINT;

ALTER TABLE task_events_participants
  ALTER COLUMN task_events_id TYPE BIGINT;

ALTER TABLE task_events_participants
  ALTER COLUMN reference_id TYPE BIGINT;

ALTER TABLE tills
  ALTER COLUMN last_changed_by_id TYPE BIGINT;

ALTER TABLE tills
  ALTER COLUMN branch_id TYPE BIGINT;

ALTER TABLE tills_accounts
  ALTER COLUMN till_id TYPE BIGINT;

ALTER TABLE tills_accounts
  ALTER COLUMN account_id TYPE BIGINT;

ALTER TABLE users
  ALTER COLUMN password_hash TYPE VARCHAR;

ALTER TABLE users
  ALTER COLUMN branch_id TYPE BIGINT;

ALTER TABLE users
  ALTER COLUMN role_id TYPE BIGINT;

ALTER TABLE vaults
  ALTER COLUMN branch_id TYPE BIGINT;

ALTER TABLE vaults_accounts
  ALTER COLUMN vault_id TYPE BIGINT;

ALTER TABLE vaults_accounts
  ALTER COLUMN account_id TYPE BIGINT;

-- =================================
-- Recreate view
-- =================================
create view searchable_profiles as
   SELECT p.id,
    p.name,
    p.type,
    p.created_at,
    p.created_by_id,
    p.status,
    string_agg(cfv.value, ' '::text) AS searchable_content,
    string_agg(cfv.status::text, ' '::text) AS custom_field_value_statuses,
    p.branch_id
   FROM profiles p
     JOIN people_custom_fields_values cfv ON cfv.owner_id = p.id
  GROUP BY p.id, p.name, p.type, p.created_at, p.created_by_id
UNION ALL
 SELECT p.id,
    p.name,
    p.type,
    p.created_at,
    p.created_by_id,
    p.status,
    string_agg(cfv.value, ' '::text) AS searchable_content,
    string_agg(cfv.status::text, ' '::text) AS custom_field_value_statuses,
    p.branch_id
   FROM profiles p
     JOIN companies_custom_fields_values cfv ON cfv.owner_id = p.id
  GROUP BY p.id, p.name, p.type, p.created_at, p.created_by_id
UNION ALL
 SELECT p.id,
    p.name,
    p.type,
    p.created_at,
    p.created_by_id,
    p.status,
    string_agg(cfv.value, ' '::text) AS searchable_content,
    string_agg(cfv.status::text, ' '::text) AS custom_field_value_statuses,
    p.branch_id
   FROM profiles p
     JOIN groups_custom_fields_values cfv ON cfv.owner_id = p.id
  GROUP BY p.id, p.name, p.type, p.created_at, p.created_by_id;