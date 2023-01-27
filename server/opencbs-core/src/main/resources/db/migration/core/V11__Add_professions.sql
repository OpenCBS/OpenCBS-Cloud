create table professions (
  id        bigserial primary key,
  name      varchar(255) not null,
  parent_id int          null
);

alter table professions
  add constraint professions_parent_id_fkey foreign key (parent_id) references professions (id);