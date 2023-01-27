create table till_events (
  id            bigserial primary key,
  event_type    varchar(40),
  till_id       bigint not null,
  teller_id     bigint not null,
  created_at    timestamp default now(),
  created_by_id bigint not null,
  comment       varchar(255)
);

alter table till_events
  add constraint till_events_till_id foreign key (till_id) references tills (id);
alter table till_events
  add constraint till_events_teller_id foreign key (teller_id) references users (id);
alter table till_events
  add constraint till_events_created_by_id foreign key (created_by_id) references users (id);