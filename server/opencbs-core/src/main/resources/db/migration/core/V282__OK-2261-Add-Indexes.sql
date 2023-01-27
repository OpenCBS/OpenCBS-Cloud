CREATE INDEX profile_accounts_profile_id_idx ON profiles_accounts(profile_id);
CREATE INDEX profile_accounts_profile_id_account_id_idx ON profiles_accounts(profile_id, account_id) ;
CREATE INDEX accounts_currency_id_idx ON accounts(currency_id);

CREATE INDEX account_balances_date_idx ON account_balances(date) ;
CREATE INDEX accounting_entries_deleted_idx ON accounting_entries(deleted);

CREATE INDEX accounting_entries_logs_handled_idx ON accounting_entries_logs(handled);
CREATE INDEX accounting_entries_logs_handled_effective_date_idx ON accounting_entries_logs(handled, effective_date);

CREATE INDEX day_closure_contracts_contract_id_process_type_idx ON day_closure_contracts(contract_id, process_type);

CREATE INDEX loan_installments_loan_id_effective_at_deleted_idx ON loans_installments(loan_id, effective_at, deleted) ;
CREATE INDEX loan_events_loan_id_effective_at_deleted_event_type_idx ON loans_events(loan_id, effective_at, event_type, deleted) ;
CREATE INDEX loan_events_loan_id_event_type_idx ON loans_events(loan_id, event_type) ;

CREATE INDEX loans_installments_rescheduled_idx On loans_installments(rescheduled);
CREATE INDEX loans_installments_loan_id_number_idx On loans_installments(loan_id, number);


CREATE INDEX loan_accounts_loan_idx On loan_accounts(loan_id);
CREATE INDEX loan_accounts_loan_id_type_idx On loan_accounts(loan_id, id, type);
