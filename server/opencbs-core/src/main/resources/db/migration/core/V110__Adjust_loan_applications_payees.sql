alter table loan_applications_payees rename disbursement_date to planned_disbursement_date;
alter table loan_applications_payees
  add column disbursement_date date,
  add column status varchar(40);