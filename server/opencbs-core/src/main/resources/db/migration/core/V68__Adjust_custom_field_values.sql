-- noinspection SqlNoDataSourceInspectionForFile
-- person
alter table people_custom_fields_values
  add column created_by_id int,
  add column created_at timestamp without time zone not null default now(),
  add column verified_by_id int,
  add column verified_at timestamp without time zone,
  add column status varchar(250),
  add column version int;

update people_custom_fields_values as pv
set created_by_id = p.created_by_id,
  status          = 'LIVE'
from profiles as p
where p.id = pv.owner_id;

alter table people_custom_fields_values
  alter column created_by_id set not null;
alter table people_custom_fields_values
  alter column status set not null;
alter table people_custom_fields_values
  add constraint people_custom_fields_values_created_at_id_fkey foreign key (created_by_id) references users (id);
alter table people_custom_fields_values
  add constraint people_custom_fields_values_verified_at_id_fkey foreign key (verified_by_id) references users (id);
alter table people_custom_fields_values
  add constraint people_custom_fields_values_version_key unique(owner_id, field_id, version);

-- company
alter table companies_custom_fields_values
  add column created_by_id int,
  add column created_at timestamp without time zone not null default now(),
  add column verified_by_id int,
  add column verified_at timestamp without time zone,
  add column status varchar(250),
  add column version int;

update companies_custom_fields_values as cv
set created_by_id = p.created_by_id,
  status          = 'LIVE'
from profiles as p
where p.id = cv.owner_id;

alter table companies_custom_fields_values
  alter column created_by_id set not null;
alter table companies_custom_fields_values
  alter column status set not null;
alter table companies_custom_fields_values
  add constraint companies_custom_fields_values_created_at_id_fkey foreign key (created_by_id) references users (id);
alter table companies_custom_fields_values
  add constraint companies_custom_fields_values_verified_at_id_fkey foreign key (verified_by_id) references users (id);
alter table companies_custom_fields_values
  add constraint companies_custom_fields_values_version_key unique(owner_id, field_id, version);