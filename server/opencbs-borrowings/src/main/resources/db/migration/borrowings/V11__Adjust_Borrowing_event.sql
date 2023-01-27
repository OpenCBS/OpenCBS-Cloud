alter table borrowing_events add column extra jsonb;

create table borrowing_events_accounting_entries (
  id                      bigserial primary key,
  borrowing_event_id integer not null references borrowing_events (id),
  accounting_entry_id     integer not null references accounting_entries (id),
  unique (borrowing_event_id, accounting_entry_id)
);