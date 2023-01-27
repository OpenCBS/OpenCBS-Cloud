-- noinspection SqlNoDataSourceInspectionForFile
alter table loan_applications
  add column disbursement_date date not null;
alter table loan_applications
  add column preferred_repayment_date date not null;