alter table request rename column contract_type to module_type;

update request set module_type = 'LOANS' where type in ('LOAN_DISBURSEMENT','LOAN_REPAYMENT','LOAN_ROLLBACK');

