-- noinspection SqlNoDataSourceInspectionForFile
create table loan_applications_entry_fees (
  id            bigserial primary key,
  amount     decimal(12, 4),
  rate     decimal(12, 4),
  loan_application_id integer not null,
  entry_fee_id integer not null
);
alter table loan_applications_entry_fees
  add constraint laef_loan_application_id_fkey foreign key (loan_application_id) references loan_applications (id) match full;
alter table loan_applications_entry_fees
  add constraint laef_entry_fee_id_fkey foreign key (entry_fee_id) references entry_fees (id) match full;