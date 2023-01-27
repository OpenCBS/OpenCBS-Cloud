alter table profiles
  add column version integer;

alter table companies_custom_fields_values
  drop constraint companies_custom_fields_values_version_key;
alter table companies_custom_fields_values
  drop column "version";

alter table people_custom_fields_values
  drop constraint people_custom_fields_values_version_key;
alter table people_custom_fields_values
  drop column "version";