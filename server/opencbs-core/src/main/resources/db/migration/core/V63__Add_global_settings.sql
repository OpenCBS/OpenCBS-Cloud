create table global_settings(
  name varchar(200) primary key,
  type varchar(50) not null,
  value text not null
);

insert into global_settings(name, type, value)
values('USE_MAKER_AND_CHECKER','BOOLEAN','false')