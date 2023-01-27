ALTER TABLE IF EXISTS branch_custom_fields_sections
ADD COLUMN code text NOT NULL DEFAULT '';

ALTER TABLE IF EXISTS companies_custom_fields_sections
ADD COLUMN code text NOT NULL DEFAULT '';

ALTER TABLE IF EXISTS people_custom_fields_sections
ADD COLUMN code text NOT NULL DEFAULT '';

ALTER TABLE IF EXISTS groups_custom_fields_sections
ADD COLUMN code text NOT NULL DEFAULT '';

ALTER TABLE IF EXISTS types_of_collateral
ADD COLUMN code text NOT NULL DEFAULT '';

ALTER TABLE IF EXISTS loan_application_custom_fields_sections
ADD COLUMN code text NOT NULL DEFAULT '';
