create table payment_methods (
  id  bigserial primary key,
  name  varchar(50) not null unique
);