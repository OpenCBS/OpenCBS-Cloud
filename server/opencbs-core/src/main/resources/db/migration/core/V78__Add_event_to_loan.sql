alter table events
  add column loan_id integer not null;
alter table events
  add constraint events_loan_id_fkey foreign key (loan_id) references loans (id) match full;