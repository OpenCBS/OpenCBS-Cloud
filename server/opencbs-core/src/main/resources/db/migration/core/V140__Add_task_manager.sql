create table task_events (
  id         bigserial primary key,
  title      varchar(255) not null,
  start_date timestamp    not null,
  end_date   timestamp    not null,
  notify_at  timestamp,
  created_at timestamp    not null,
  created_by integer      not null,
  all_day    boolean      not null
);
alter table task_events
  add constraint event_created_by_fkey foreign key (created_by) references users (id);


create table event_participants (
  id             bigserial primary key,
  task_events_id integer      not null,
  type           varchar(255) not null,
  reference_id   integer      not null
);
alter table event_participants
  add constraint event_participants_event_id_fkey foreign key (task_events_id) references task_events (id);