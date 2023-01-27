-- noinspection SqlNoDataSourceInspectionForFile
alter table companies_attachments
  rename original_name to original_filename;

alter table loan_applications_attachments
  rename original_name to original_filename;

alter table people_attachments
  rename original_name to original_filename;