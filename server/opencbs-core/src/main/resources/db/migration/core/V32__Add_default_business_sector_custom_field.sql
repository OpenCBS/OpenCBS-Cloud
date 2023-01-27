-- noinspection SqlNoDataSourceInspectionForFile
insert into companies_custom_fields
(section_id, name, field_type, caption, is_unique, is_required, "order", extra)
values (1, 'business_sector', 'LOOKUP', 'Business Sector', false, true, 2, '{"key":"business-sectors"}');
