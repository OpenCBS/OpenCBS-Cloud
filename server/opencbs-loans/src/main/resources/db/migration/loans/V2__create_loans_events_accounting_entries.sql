create table loans_events_accounting_entries (
  id                    bigserial      primary key,
  loan_event_id         bigint         not null,
  accounting_entry_id   bigint         not null,

  unique (loan_event_id, accounting_entry_id),
  foreign key (loan_event_id) references loans_events (id),
  foreign key (accounting_entry_id) references accounting_entries (id)
);

create sequence loans_events_group_key;