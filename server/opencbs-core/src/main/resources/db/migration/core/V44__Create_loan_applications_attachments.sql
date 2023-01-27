-- noinspection SqlNoDataSourceInspectionForFile
create table loan_applications_attachments (
  id                   bigserial primary key,
  loan_application_id bigint                      not null,
  filename             varchar(255)                not null,
  content_type         varchar(255)                not null,
  pinned               boolean                     not null default false,
  created_at           timestamp without time zone not null,
  created_by_id        bigint                      not null
);

alter table loan_applications_attachments
  add constraint loan_applications_attachments_loan_application_id_fkey
foreign key (loan_application_id) references loan_applications (id);

alter table loan_applications_attachments
  add constraint loan_applications_attachments_created_by_id_fkey
foreign key (created_by_id) references users (id);