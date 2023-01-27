create table branches (
  id bigserial primary key,
  name varchar(255) not null,
  code varchar(15) not null,
  address varchar(255)
);