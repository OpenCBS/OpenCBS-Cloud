-- noinspection SqlNoDataSourceInspectionForFile
create table loan_applications_installments (
  id                  bigserial primary key,
  number              integer        not null,
  maturity_date       date           not null,
  interest            decimal(14, 4) not null,
  principal           decimal(14, 4) not null,
  olb                 decimal(14, 4) not null,
  loan_application_id integer        not null
);
alter table loan_applications_installments
  add constraint loan_applications_installments_loan_application_id_fkey
foreign key (loan_application_id) references loan_applications (id) match full;