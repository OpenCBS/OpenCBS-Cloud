create table day_closure_entities
(
  id                         bigserial primary key,
  entity_id                  bigint       not null,
  day_closure_container_type varchar(255) not null,
  actual_date                date         not null,
  error_message              varchar(255) null,

  unique (entity_id, day_closure_container_type, actual_date)
);