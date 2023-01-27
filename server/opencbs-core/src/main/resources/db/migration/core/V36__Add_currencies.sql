create table currencies (
  id bigserial primary key,
  name varchar(200) not null unique
);