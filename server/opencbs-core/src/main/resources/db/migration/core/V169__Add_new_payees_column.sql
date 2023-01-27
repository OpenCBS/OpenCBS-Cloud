alter table loan_applications_payees
  add column closed_at timestamp null;

alter table loan_applications_payees
  add column closed_by_id bigint null;