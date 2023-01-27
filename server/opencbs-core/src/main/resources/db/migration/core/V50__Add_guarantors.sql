create table guarantors (
  id bigserial primary key,
  profile_id integer not null,
  relationship_id integer not null,
  loan_application_id integer not null,
  description varchar(255) ,
  amount decimal(16, 4) not null
);
alter table guarantors
  add constraint guarantors_profile_id_fkey foreign key (profile_id) references profiles (id) match full;
alter table guarantors
  add constraint guarantors_relationship_id_fkey foreign key (relationship_id) references relationships (id) match full;
alter table guarantors
  add constraint guarantors_loan_application_id_fkey foreign key (loan_application_id) references loan_applications (id) match full;