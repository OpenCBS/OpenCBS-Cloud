CREATE TABLE loans
(
  id                      bigserial primary key,
  amount                  decimal(14, 4) not null,
  grace_period            integer                     not null default 0,
  maturity                integer                     not null default 1,
  loan_application_id     integer                     not null,
  schedule_type           varchar(255)                not null,
  created_at              timestamp                   not null default now(),
  created_by_id           integer                     not null default 1,
  interest_rate           decimal(8, 4)               not null,
  preferred_repayment_date date                        not null
);

alter table loans
  add constraint loans_loan_application_id_fkey foreign key (loan_application_id) references loan_applications (id) match full;

alter table loans
  add constraint loans_created_by_id_fkey foreign key (created_by_id) references users (id) match full;