-- noinspection SqlNoDataSourceInspectionForFile
drop view if exists searchable_profiles;
create view searchable_profiles as
select
    p.id
    , p.name
    , p."type"
    , p.created_at
    , p.created_by_id
    , string_agg(cfv.value, ' ') searchable_content
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
    , string_agg(cfv.value, ' ') searchable_content
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
