create table groups_custom_fields_sections
(
  id      bigserial primary key,
  caption varchar(255)      not null,
  "order" integer default 0 not null
);

create table groups_custom_fields
(
  id          bigserial primary key,
  section_id  bigint                not null,
  name        varchar(255)          not null unique,
  field_type  varchar(31)           not null,
  caption     varchar(255)          not null,
  is_unique   boolean default false not null,
  is_required boolean default false not null,
  "order"     integer default 0     not null,
  extra       text
);

alter table groups_custom_fields
  add constraint groups_custom_fields_section_id_fkey
foreign key (section_id) references groups_custom_fields_sections (id);

create table groups_custom_fields_values
(
  id             bigserial primary key,
  owner_id       bigint                  not null,
  field_id       bigint                  not null,
  value          text,
  created_by_id  integer                 not null,
  created_at     timestamp default now() not null,
  verified_by_id integer,
  verified_at    timestamp,
  status         varchar(250)            not null
);

alter table groups_custom_fields_values
  add constraint groups_custom_fields_values_owner_id_fkey
foreign key (owner_id) references profiles (id);

alter table groups_custom_fields_values
  add constraint groups_custom_fields_values_field_id_fkey foreign key (field_id)
references groups_custom_fields (id);

alter table groups_custom_fields_values
  add constraint groups_custom_fields_values_created_by_id_fkey foreign key (created_by_id)
references users (id);
alter table groups_custom_fields_values
  add constraint groups_custom_fields_values_verified_by_id_fkey foreign key (verified_by_id)
references users (id);

insert into groups_custom_fields_sections (caption, "order") values ('Details', 1);

insert into groups_custom_fields
(section_id, name, field_type, caption, is_unique, is_required, "order", extra)
values
  (1, 'name', 'TEXT', 'Name', false, true, 1, null);

drop view if exists searchable_profiles;
create view searchable_profiles as
  select
    p.id
    , p.name
    , p."type"
    , p.created_at
    , p.created_by_id
    , p."status"
    , string_agg(cfv.value, ' ')  searchable_content
    , string_agg(cfv.status, ' ') custom_field_value_statuses
    , p.branch_id
  from
    profiles p
    inner join
    people_custom_fields_values cfv on cfv.owner_id = p.id
  group by
    p.id
    , p.name
    , p."type"
    , p.created_at
    , p.created_by_id

  union all

  select
    p.id
    , p.name
    , p."type"
    , p.created_at
    , p.created_by_id
    , p."status"
    , string_agg(cfv.value, ' ')  searchable_content
    , string_agg(cfv.status, ' ') custom_field_value_statuses
    , p.branch_id
  from
    profiles p
    inner join
    companies_custom_fields_values cfv on cfv.owner_id = p.id
  group by
    p.id
    , p.name
    , p."type"
    , p.created_at
    , p.created_by_id

  union all

  select
    p.id
    , p.name
    , p."type"
    , p.created_at
    , p.created_by_id
    , p."status"
    , string_agg(cfv.value, ' ')  searchable_content
    , string_agg(cfv.status, ' ') custom_field_value_statuses
    , p.branch_id
  from
    profiles p
    inner join
    groups_custom_fields_values cfv on cfv.owner_id = p.id
  group by
    p.id
    , p.name
    , p."type"
    , p.created_at
    , p.created_by_id;