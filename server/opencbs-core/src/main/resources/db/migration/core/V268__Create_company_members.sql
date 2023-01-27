create table companies_members (
  id          bigserial   primary key,
  company_id  bigint      not null references profiles(id),
  member_id   bigint      not null references profiles(id),
  join_date   timestamp   not null,
  left_date   timestamp
)