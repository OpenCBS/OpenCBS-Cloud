alter table loan_attachments
  rename loan_id to owner_id;
alter table loan_attachments
  add column original_filename varchar(255);