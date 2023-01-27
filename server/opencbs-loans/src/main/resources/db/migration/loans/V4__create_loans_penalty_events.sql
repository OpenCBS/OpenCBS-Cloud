create table loans_penalties_events (
  id bigserial not null primary key,
  event_type varchar(200) not null,
  created_at timestamp not null,
  created_by_id bigint not null
  constraint loans_penalties_events_created_by_id_fkey
  references users,
  loan_id bigint not null
  constraint loans_penalties_events_loan_id_fkey
  references loans,
  loan_application_penalty_id bigint not null
    constraint loans_penalties_events_loan_aplication_penalty_id_fkey
    references loan_application_penalties,
    deleted boolean default false not null,
  effective_at timestamp not null,
  installment_number integer,
  amount numeric(12,2) default 0 not null,
  group_key bigint default 0 not null,
  rolled_back_by_id bigint
  constraint loans_penalties_events_rolled_back_by_id_fkey
  references users,
  rolled_back_date timestamp,
  comment varchar(255),
  system boolean default false,
  extra jsonb
  )
;

create index loans_penalties_events_idx
  on loans_penalties_events (loan_id, loan_application_penalty_id)
;

create index loans_penalties_events_loan_id_event_type_index
  on loans_events (loan_id, event_type)
;


create table loans_penalty_events_accounting_entries (
  loan_penalty_event_id bigint not null
    constraint loans_penalty_events_accounting_entries_penalty_event_fkey
    references loans_penalties_events,
  accounting_entry_id  bigint not null
    constraint loans_penalty_events_accounting_entries_accounting_entries_fkey
    references accounting_entries
);

create index loans_penalty_events_accounting_entries_idx
  on loans_penalty_events_accounting_entries (loan_penalty_event_id, accounting_entry_id)
;

create index loans_penalty_events_accounting_entries_loan_penalty_event_idx
  on loans_penalty_events_accounting_entries (loan_penalty_event_id)
;

create index loans_penalty_events_accounting_entries_accounting_entry_idx
  on loans_penalty_events_accounting_entries (accounting_entry_id)
;