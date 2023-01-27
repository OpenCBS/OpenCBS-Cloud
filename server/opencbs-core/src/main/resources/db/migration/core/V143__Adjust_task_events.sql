alter table task_events
  add column content varchar(255) not null;

alter table event_participants
  rename to task_events_participants;

alter table task_events_participants
  drop constraint event_participants_event_id_fkey;

alter table task_events_participants
  add constraint task_events_participants_event_id_fkey foreign key (task_events_id) references task_events (id);