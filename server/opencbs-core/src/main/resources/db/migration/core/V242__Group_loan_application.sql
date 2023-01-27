create table group_loan_applications (
  id                  bigserial      primary key,
  group_id            bigint         not null references profiles,
  member_id           bigint         not null references profiles,
  loan_application_id bigint         not null references loan_applications,
  amount              numeric(12, 2) not null,

  unique (member_id, loan_application_id)
);

alter table loans
  add column profile_id bigint references profiles;