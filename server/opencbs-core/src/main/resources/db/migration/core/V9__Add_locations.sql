-- noinspection SqlNoDataSourceInspectionForFile
create table locations (
  id bigserial primary key,
  name varchar(255) not null,
  parent_id int null
);

alter table locations add constraint locations_parent_id_fkey foreign key (parent_id) references locations(id);
