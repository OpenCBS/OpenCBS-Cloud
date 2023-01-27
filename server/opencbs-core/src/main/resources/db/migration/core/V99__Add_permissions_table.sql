-- noinspection SqlNoDataSourceInspectionForFile
create table permissions (
  id    bigserial primary key,
  name  varchar(31)  not null,
  "group" varchar(355) not null
);

insert into permissions (name, "group")
values
  ('MAKER_FOR_PROFILE', 'Maker and Checker'),
  ('CHECKER_FOR_PROFILE', 'Maker and Checker'),
  ('TELLER', 'Till Permissions'),
  ('HEAD_TELLER', 'Till Permissions')