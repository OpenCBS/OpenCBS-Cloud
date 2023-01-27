-- noinspection SqlNoDataSourceInspectionForFile
alter table companies_attachments
  rename company_id to owner_id;
alter table companies_attachments
  add column original_name varchar(255);

alter table loan_applications_attachments
  rename loan_application_id to owner_id;
alter table loan_applications_attachments
  add column original_name varchar(255);

alter table people_attachments
  rename person_id to owner_id;
alter table people_attachments
  add column original_name varchar(255);