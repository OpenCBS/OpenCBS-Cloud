alter table people_custom_fields add column deleted boolean default false;
alter table companies_custom_fields add column deleted boolean default false;
alter table groups_custom_fields add column deleted boolean default false;
alter table loan_application_custom_fields add column deleted boolean default false;
alter table branch_custom_fields add column deleted boolean default false;
alter table types_of_collateral_custom_fields add column deleted boolean default false;