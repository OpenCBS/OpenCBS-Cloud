-- noinspection SqlNoDataSourceInspectionForFile
create table business_sectors (
  id bigserial primary key,
  name varchar(255) not null,
  parent_id int null
);

alter table business_sectors add constraint business_sector_parent_id_fkey foreign key (parent_id) references business_sectors(id);
