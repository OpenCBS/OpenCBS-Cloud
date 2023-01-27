alter table profile_attachments
   add column "comment" varchar(280);

alter table loan_applications_attachments
   add column "comment" varchar(280);

create table loan_attachments (
  id                   bigserial primary key,
  loan_id              bigint                      not null,
  filename             varchar(255)                not null,
  content_type         varchar(255)                not null,
  pinned               boolean                     not null default false,
  created_at           timestamp without time zone not null,
  created_by_id        bigint                      not null,
  "comment"            varchar(280)                null
);

alter table loan_attachments
  add constraint loan_attachments_loan_id_fkey
foreign key (loan_id) references loans (id);

alter table loan_attachments
  add constraint loan_attachments_created_by_id_fkey
foreign key (created_by_id) references users (id);

alter table people_attachments
   add column "comment" varchar(280);

alter table companies_attachments
   add column "comment" varchar(280);