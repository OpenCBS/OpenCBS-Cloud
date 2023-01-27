alter table loan_application_custom_fields
  add constraint loan_application_custom_fields_name_section_id_pk unique (name, section_id);
alter table loan_application_custom_fields drop constraint loan_application_custom_fields_name_key;

alter table companies_custom_fields
  add constraint companies_custom_fields_name_section_id_pk unique (name, section_id);
alter table companies_custom_fields drop constraint companies_custom_fields_name_key;

alter table groups_custom_fields
  add constraint groups_custom_fields_name_section_id_pk unique (name, section_id);
alter table groups_custom_fields drop constraint groups_custom_fields_name_key;

alter table people_custom_fields
  add constraint people_custom_fields_name_section_id_pk unique (name, section_id);
alter table people_custom_fields drop constraint people_custom_fields_name_key;