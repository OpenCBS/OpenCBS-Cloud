create table credit_committee_votes_history(
  id bigserial primary key,
  loan_application_id integer not null,
  role_id integer not null,
  status varchar(200) not null,
  old_status varchar(200) not null,
  changed_by_id integer,
  notes varchar(255),
  created_at timestamp
);

alter table credit_committee_votes_history
  add constraint credit_committee_votes_loan_application_id_fkey foreign key (loan_application_id) references loan_applications (id);
alter table credit_committee_votes_history
  add constraint credit_committee_votes_role_id_fkey foreign key (role_id) references roles (id);
alter table credit_committee_votes_history
  add constraint credit_committee_votes_changed_by_id_fkey foreign key (changed_by_id) references users (id);