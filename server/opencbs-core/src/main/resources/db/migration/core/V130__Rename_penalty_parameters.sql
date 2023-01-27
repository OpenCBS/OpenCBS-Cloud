alter table loan_products rename loan_amount to penalty_to_loan_amount;
alter table loan_products rename olb to penalty_to_olb;
alter table loan_products rename overdue_principal to penalty_to_overdue_principal;
alter table loan_products rename overdue_interest to penalty_to_overdue_interest;

alter table loans rename loan_amount to penalty_to_loan_amount;
alter table loans rename olb to penalty_to_olb;
alter table loans rename overdue_principal to penalty_to_overdue_principal;
alter table loans rename overdue_interest to penalty_to_overdue_interest;

alter table loan_applications rename loan_amount to penalty_to_loan_amount;
alter table loan_applications rename olb to penalty_to_olb;
alter table loan_applications rename overdue_principal to penalty_to_overdue_principal;
alter table loan_applications rename overdue_interest to penalty_to_overdue_interest;


update global_settings set value = 'fundAccessPenaltyCalculationService' where name = 'PENALTY_ACCRUAL';