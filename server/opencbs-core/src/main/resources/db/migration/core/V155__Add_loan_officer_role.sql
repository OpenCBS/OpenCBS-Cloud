insert into roles (name)
values ('Loan Officer');

alter table loan_applications
  add column loan_officer_id int null;

update loan_applications
set loan_officer_id = 2;

alter table loan_applications
  alter column loan_officer_id set not null;

alter table loan_applications
  add constraint loan_applications_loan_officer_id_fkey foreign key (loan_officer_id) references users (id);

alter table loans
  add column loan_officer_id int null;

update loans
set loan_officer_id = 2;

alter table loans
  alter column loan_officer_id set not null;

alter table loans
  add constraint loans_loan_officer_id_fkey foreign key (loan_officer_id) references users (id);
