alter table audit.companies_custom_fields_values_history alter column value type text using value::text;
alter table audit.groups_custom_fields_values_history alter column value type text using value::text;
alter table audit.people_custom_fields_values_history alter column value type text using value::text;



