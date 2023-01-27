create table loan_applications_payees (
  id bigserial primary key,
  amount decimal(16, 4) not null,
  description varchar(255),
  loan_application_id integer not null,
  payee_id integer not null,
  disbursement_date date not null
);

alter table loan_applications_payees
  add constraint loan_applications_payee_id_fkey foreign key (payee_id) references payees(id);
alter table loan_applications_payees
  add constraint loan_applications_payee_loan_application_id_fkey foreign key (loan_application_id) references loan_applications(id);