alter table task_events_participants
    add column is_deleted boolean not null default false ;