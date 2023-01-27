alter table profiles
add column branch_id integer not null default 1;

alter table profiles
add constraint profiles_branch_id_key foreign key (branch_id) references branches (id);

drop view if exists searchable_profiles;
create view searchable_profiles as
  select
    p.id
    , p.name
    , p."type"
    , p.created_at
    , p.created_by_id
    , p."status"
    , string_agg(cfv.value, ' ') searchable_content
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
    , string_agg(cfv.value, ' ') searchable_content
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
    , p.created_by_id;

 update profiles set branch_id = 1;