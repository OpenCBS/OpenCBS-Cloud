-- noinspection SqlNoDataSourceInspectionForFile
create table loan_applications (
  id              bigserial primary key,
  amount          decimal(14, 4)              not null,
  grace_period    integer                     not null default 0,
  maturity        integer                     not null default 1,
  profile_id      integer                     not null,
  loan_product_id integer                     not null,
  schedule_type   varchar(255)                not null,
  created_at      timestamp without time zone not null default now(),
  created_by_id   integer                     not null default 1
);
alter table loan_applications
  add constraint loan_applications_profile_id_fkey foreign key (profile_id) references profiles (id) match full;
alter table loan_applications
  add constraint loan_applications_loan_product_id_fkey foreign key (loan_product_id) references loan_products (id) match full;
alter table loan_applications
  add constraint loan_applications_created_by_id_fkey foreign key (created_by_id) references users (id) match full;