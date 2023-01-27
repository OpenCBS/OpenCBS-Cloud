-- noinspection SqlNoDataSourceInspectionForFile
alter table tills
  add column "status" varchar(32) not null;

alter table tills
  add column last_changed_by_id int not null;

alter table tills
  add column opened_at timestamp;

alter table tills
  add column closed_at timestamp;

alter table tills
  add constraint till_last_changed_by_id_fkey foreign key (last_changed_by_id) references users (id);