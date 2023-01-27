-- noinspection SqlNoDataSourceInspectionForFile
create table profile_attachments (
  id bigserial primary key,
  type varchar(20) not null,
  profile_id bigint not null,
  name varchar(255) not null,
  content_type varchar(255) not null,
  created_date date not null,
  created_user_id bigint not null
);

alter table profile_attachments add constraint profile_attachments_profile_id_fkey foreign key (profile_id) references profiles(id);
alter table profile_attachments add constraint profile_attachments_created_user_id_fkey foreign key (created_user_id) references users(id);
