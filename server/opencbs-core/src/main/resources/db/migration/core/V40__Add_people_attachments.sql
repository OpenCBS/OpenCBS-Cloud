-- noinspection SqlNoDataSourceInspectionForFile
create table people_attachments (
  id bigserial primary key,
  person_id bigint not null,
  filename varchar(255) not null,
  content_type varchar(255) not null,
  pinned boolean not null default false,
  created_at timestamp without time zone not null,
  created_by_id bigint not null
);

alter table people_attachments
add constraint people_attachments_person_id_fkey
foreign key (person_id) references profiles(id);

alter table people_attachments
add constraint people_attachments_created_by_id_fkey
foreign key (created_by_id) references users(id);

insert into people_attachments (id, person_id, filename, content_type, pinned, created_at, created_by_id)
select id, profile_id, name, content_type, pinned, created_at, created_by_id
from profile_attachments
where "type" = 'PERSON';

select setval('people_attachments_id_seq', (select max(id) from profile_attachments where "type" = 'PERSON'));
