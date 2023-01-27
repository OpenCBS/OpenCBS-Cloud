-- noinspection SqlNoDataSourceInspectionForFile
alter table users
add column time_zone_name varchar(31) not null default 'Asia/Bishkek';
