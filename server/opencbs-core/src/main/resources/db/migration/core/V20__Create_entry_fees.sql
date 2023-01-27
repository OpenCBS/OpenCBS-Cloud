-- noinspection SqlNoDataSourceInspectionForFile
create table entry_fees (
  id            bigserial primary key,
  name          varchar(255)   not null,
  max_value     decimal(8, 4) not null,
  min_value     decimal(8, 4) not null,
  is_percentage boolean        not null,
  upper_limit   decimal(11, 4) not null
)