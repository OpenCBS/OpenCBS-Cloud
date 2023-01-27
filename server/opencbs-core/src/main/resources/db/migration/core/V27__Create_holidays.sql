-- noinspection SqlNoDataSourceInspectionForFile
create table holidays (
  id     bigserial primary key,
  name   varchar(255) not null ,
  date   date not null,
  annual boolean not null
)