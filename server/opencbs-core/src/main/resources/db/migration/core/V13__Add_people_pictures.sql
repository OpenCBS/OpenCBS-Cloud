-- noinspection SqlNoDataSourceInspectionForFile
create table people_pictures (
  id bigserial primary key,
  person_id bigint not null,
  type varchar(31) not null,
  content_type varchar(31) not null,
  file_name varchar(31) not null,
  created_by_id bigint not null,
  created_at timestamp without time zone not null,
  verified_by_id bigint null,
  verified_at timestamp without time zone null,
  status varchar(31) not null
);

alter table people_pictures add constraint people_pictures_person_id_fkey foreign key (person_id) references profiles(id);
alter table people_pictures add constraint people_pictures_created_by_id_fkey foreign key (created_by_id) references users(id);
alter table people_pictures add constraint people_pictures_verified_by_id_fkey foreign key (verified_by_id) references users(id);
