create index if not exists loans_installments_number_index on public.loans_installments (number);
create index if not exists loans_installments_loan_id_number_index on public.loans_installments (loan_id, number);

create index if not exists loans_events_loan_id_index on public.loans_events (loan_id);
create index if not exists loans_events_loan_id_event_type_index on public.loans_events (loan_id, event_type);