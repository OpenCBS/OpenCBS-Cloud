create table loan_application_custom_fields_sections
(
  id      bigserial primary key,
  caption varchar(255)      not null,
  "order" integer default 0 not null
);

create table loan_application_custom_fields
(
  id          bigserial primary key,
  section_id  bigint                not null,
  name        varchar(255)          not null unique,
  field_type  varchar(31)           not null,
  caption     varchar(255)          not null,
  is_unique   boolean default false not null,
  is_required boolean default false not null,
  "order"     integer default 0     not null,
  extra       text
);

alter table loan_application_custom_fields
  add constraint loan_application_custom_fields_section_id_fkey
foreign key (section_id) references loan_application_custom_fields_sections (id);

create table loan_application_custom_fields_values
(
  id             bigserial primary key,
  owner_id       bigint                  not null,
  field_id       bigint                  not null,
  value          text,
  created_by_id  integer                 not null,
  created_at     timestamp default now() not null,
  verified_by_id integer,
  verified_at    timestamp,
  status         varchar(250)            not null
);

alter table loan_application_custom_fields_values
  add constraint loan_application_custom_fields_values_owner_id_fkey
foreign key (owner_id) references loan_applications (id);

alter table loan_application_custom_fields_values
  add constraint loan_application_custom_fields_values_field_id_fkey foreign key (field_id)
references loan_application_custom_fields (id);

alter table loan_application_custom_fields_values
  add constraint loan_application_custom_fields_values_created_by_id_fkey foreign key (created_by_id)
references users (id);
alter table loan_application_custom_fields_values
  add constraint loan_application_custom_fields_values_verified_by_id_fkey foreign key (verified_by_id)
references users (id);