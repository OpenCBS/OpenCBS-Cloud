-- noinspection SqlNoDataSourceInspectionForFile
create table users (
  id bigserial primary key,
  username varchar(50) not null,
  first_name varchar(255) not null,
  last_name varchar(255) not null,
  password char(60) not null
);

insert into users (username, first_name, last_name, password)
values ('admin', 'Jon', 'Snow', '$2a$10$XmtWixcSIQVNuX.j3SY7ZegiojYcKp.yE1MtqgF7VAy6e1GclZITm');
