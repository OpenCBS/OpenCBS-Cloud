-- noinspection SqlNoDataSourceInspectionForFile
alter table profile_attachments rename created_user_id to created_by_id;
alter table profile_attachments rename constraint profile_attachments_created_user_id_fkey to profile_attachments_created_by_id_fkey;

alter table profile_attachments add column created_at timestamp without time zone null;
update profile_attachments set created_at = created_date;
alter table profile_attachments alter column created_at set not null;

alter table profile_attachments drop column created_date;
