-- noinspection SqlNoDataSourceInspectionForFile
create table loan_purposes (
  id bigserial primary key,
  name varchar(200) not null unique,
  parent_id int null
);

alter table loan_purposes
  add constraint loan_purposes_parent_id_fkey foreign key (parent_id) references loan_purposes (id);