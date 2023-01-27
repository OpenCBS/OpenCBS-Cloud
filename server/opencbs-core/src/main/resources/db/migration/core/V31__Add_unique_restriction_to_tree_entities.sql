-- noinspection SqlNoDataSourceInspectionForFile
alter table locations
  add constraint locations_name_key unique (name);

alter table professions
  add constraint professions_name_key unique (name);

alter table business_sectors
  add constraint business_sectors_name_key unique (name);