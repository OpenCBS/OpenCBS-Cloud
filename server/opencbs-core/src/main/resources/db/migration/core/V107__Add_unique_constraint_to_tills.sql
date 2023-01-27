-- noinspection SqlNoDataSourceInspectionForFile
alter table tills
  add constraint tills_name_key unique (name);