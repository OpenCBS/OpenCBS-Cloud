CREATE INDEX IF NOT EXISTS accounting_entries_debit_account_id_idx ON accounting_entries(debit_account_id);
CREATE INDEX IF NOT EXISTS accounting_entries_credit_account_id_idx ON accounting_entries(credit_account_id);
CREATE INDEX IF NOT EXISTS accounting_entries_effective_at_deleted_idx ON accounting_entries(effective_at, deleted);