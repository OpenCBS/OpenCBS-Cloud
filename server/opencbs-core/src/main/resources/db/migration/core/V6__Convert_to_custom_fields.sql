-- noinspection SqlNoDataSourceInspectionForFile

-- Since we are converting hard-coded profile fields to custom fields
-- we have to drop the obsolete columns in the `profiles` table.
-- At this point there is no need to convert data since there is not
-- much data yet (i.e. the software is not in production and there is
-- no real live database).
alter table profiles drop column first_name, drop column last_name, drop column birth_date;

-- Prepend boolean fields with is_
alter table custom_fields rename column "unique" to is_unique;
alter table custom_fields rename column "required" to is_required;

-- name is an alternative way of identifying custom fields
alter table custom_fields add name varchar(31);

-- onwer_type + name should be unique
alter table custom_fields add constraint custom_fields_owner_type_name_key unique(owner_type, "name");

-- Add default profile custom fields
insert into custom_fields
  (owner_type, field_type, "name", caption, is_unique, is_required, "order", extra)
values
  ('PERSON', 'TEXT', 'first_name', 'First name', false, true, 1, null),
  ('PERSON', 'TEXT', 'last_name', 'Last name', false, true, 2, null),
  ('PERSON', 'DATE', 'birth_date', 'Birth date', false, true, 3, null),
  ('COMPANY', 'TEXT', 'name', 'Name', false, true, 1, null)
;
