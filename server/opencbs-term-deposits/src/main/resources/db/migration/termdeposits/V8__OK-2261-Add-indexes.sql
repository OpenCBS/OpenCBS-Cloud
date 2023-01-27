CREATE INDEX term_deposit_accounts_term_deposit_id_type_idx ON term_deposit_accounts(term_deposit_id, type) ;
CREATE INDEX term_deposit_code_idx ON term_deposits(code) ;
CREATE INDEX term_deposit_status_branch_id_idx ON term_deposits(status, branch_id) ;