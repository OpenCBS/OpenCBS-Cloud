alter table loans_events
  add column other_fee_id integer;
alter table loans_events
  add constraint loans_events_other_fee_id_fkey foreign key (other_fee_id) references other_fees (id);