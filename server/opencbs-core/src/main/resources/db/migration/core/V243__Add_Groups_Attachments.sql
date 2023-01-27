-- noinspection SqlNoDataSourceInspectionForFile
create table groups_attachments (
  id                bigserial       primary key,
  owner_id          bigint          not null,
  filename          varchar (255)   not null,
  content_type      varchar(255)    not null,
  pinned            boolean         not null default false,
  created_at        timestamp       without time zone not null,
  created_by_id     bigint          not null,
  original_filename varchar (255)   not null,
  comment           varchar(255)
);

alter table groups_attachments
add constraint groups_attachments_group_id_fkey
foreign key (owner_id) references profiles(id);

alter table groups_attachments
add constraint groups_attachments_created_by_id_fkey
foreign key (created_by_id) references users(id);