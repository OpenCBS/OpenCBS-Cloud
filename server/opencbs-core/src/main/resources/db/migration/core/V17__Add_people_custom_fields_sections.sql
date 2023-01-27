-- noinspection SqlNoDataSourceInspectionForFile

-- Create tables related to custom fields with regards to personal profiles
create table people_custom_fields_sections (
  id bigserial primary key,
  caption varchar(255) not null,
  "order" int not null default(0)
);

create table people_custom_fields (
  id bigserial primary key,
  section_id bigint not null,
  name varchar(255) not null,
  field_type varchar(31) not null,
  caption varchar(255) not null,
  is_unique boolean not null default false,
  is_required boolean not null default false,
  "order" int not null default(0),
  extra text null
);

alter table people_custom_fields
add constraint people_custom_fields_section_id_fkey
foreign key (section_id)
references people_custom_fields_sections(id);

create table people_custom_fields_values (
  id bigserial primary key,
  owner_id bigint not null,
  field_id bigint not null,
  value text null
);

alter table people_custom_fields_values
add constraint people_custom_fields_values_owner_id_fkey
foreign key (owner_id)
references profiles(id);

alter table people_custom_fields_values
add constraint people_custom_fields_values_field_id_fkey
foreign key (field_id)
references people_custom_fields(id);

-- Add default custom field section
insert into people_custom_fields_sections (id, caption, "order") values (1, 'Details', 1);
select setval('people_custom_fields_sections_id_seq', 1);

-- Migrate custom field metadata
insert into people_custom_fields
(id, section_id, name, field_type, caption, is_unique, is_required, "order", extra)
select id, 1, name, field_type, caption, is_unique, is_required, "order", extra
from custom_fields
where owner_type = 'PERSON';

select setval('people_custom_fields_id_seq', (select max(id) from custom_fields where owner_type = 'PERSON'));

-- Migrate custom field values
insert into people_custom_fields_values (owner_id, field_id, value)
select
  owner_id, field_id, value
from
  custom_field_values
where
  owner_type = 'PERSON';

-- Create tables related to custom fields with regards to company profiles
create table companies_custom_fields_sections (
  id bigserial primary key,
  caption varchar(255) not null,
  "order" int not null default(0)
);

create table companies_custom_fields (
  id bigserial primary key,
  section_id bigint not null,
  name varchar(255) not null,
  field_type varchar(31) not null,
  caption varchar(255) not null,
  is_unique boolean not null default false,
  is_required boolean not null default false,
  "order" int not null default(0),
  extra text null
);

alter table companies_custom_fields
add constraint companies_custom_fields_section_id_fkey
foreign key (section_id)
references companies_custom_fields_sections(id);

create table companies_custom_fields_values (
  id bigserial primary key,
  owner_id bigint not null,
  field_id bigint not null,
  value text null
);

alter table companies_custom_fields_values
add constraint companies_custom_fields_values_owner_id_fkey
foreign key (owner_id)
references profiles(id);

alter table companies_custom_fields_values
add constraint companies_custom_fields_values_field_id_fkey
foreign key (field_id)
references companies_custom_fields(id);

-- Add default custom field section
insert into companies_custom_fields_sections (id, caption, "order") values (1, 'Details', 1);
select setval('companies_custom_fields_sections_id_seq', 1);

-- Migrate custom field metadata
insert into companies_custom_fields
(id, section_id, name, field_type, caption, is_unique, is_required, "order", extra)
  select id, 1, name, field_type, caption, is_unique, is_required, "order", extra
  from custom_fields
  where owner_type = 'COMPANY';

select setval('companies_custom_fields_id_seq', (select max(id) from custom_fields where owner_type = 'COMPANY'));

-- Migrate custom field values
insert into companies_custom_fields_values (owner_id, field_id, value)
  select
    owner_id, field_id, value
  from
    custom_field_values
  where
    owner_type = 'COMPANY';
