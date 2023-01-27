alter table events
  add column effective_at timestamp;

update events
set effective_at = now();

alter table events
  alter column effective_at set not null;