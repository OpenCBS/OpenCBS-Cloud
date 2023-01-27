-- noinspection SqlNoDataSourceInspectionForFile
alter table loan_applications_installments
  add column last_accrual_date date;