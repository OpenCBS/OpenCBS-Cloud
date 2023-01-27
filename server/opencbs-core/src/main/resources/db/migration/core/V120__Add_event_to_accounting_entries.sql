alter table accounting_entries
    add column event_id integer;
alter table accounting_entries
    add constraint accounting_entries_accounting_entries_fkey foreign key (event_id) references loans_events (id) match full;