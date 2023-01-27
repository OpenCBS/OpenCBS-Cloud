-- noinspection SqlNoDataSourceInspectionForFile
alter table profiles add column created_at timestamp without time zone not null default now();
alter table profiles add column created_by_id bigint not null default 1;
alter table profiles add constraint profiles_created_by_id_fkey foreign key (created_by_id) references users(id);
