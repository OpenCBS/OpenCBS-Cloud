CREATE INDEX saving_accounts_saving_id_type_idx ON savings_accounts(saving_id, type) ;
CREATE INDEX saving_status_branch_id_idx ON savings(status, branch_id) ;