alter table branches
drop column address,
drop column description,
drop column location_id,
drop column category,
drop column license_date,
drop column open_date,
drop column close_date,
drop column status;

create table branch_custom_fields_sections (
  id bigserial primary key,
  caption varchar(255) not null,
  "order" int not null default(0)
);

create table branch_custom_fields (
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

alter table branch_custom_fields
add constraint branch_custom_fields_sections_id_fkey
foreign key (section_id)
references branch_custom_fields_sections(id);

create table branch_custom_fields_values (
  id bigserial primary key,
  owner_id bigint not null,
  field_id bigint not null,
  value text null,
  created_by_id  bigint not null,
  created_at timestamp not null,
  verified_by_id bigint not null,
  verified_at timestamp not null,
  status varchar(255)
);

alter table branch_custom_fields_values
add constraint branch_custom_fields_values_owner_id_fkey
foreign key (owner_id)
references branches(id);

alter table branch_custom_fields_values
add constraint branch_custom_fields_values_field_id_fkey
foreign key (field_id)
references branch_custom_fields(id);

alter table branch_custom_fields_values
add constraint branch_custom_fields_values_created_by_id_fkey
foreign key (created_by_id)
references users(id);

alter table branch_custom_fields_values
add constraint branch_custom_fields_values_verified_by_id_fkey
foreign key (verified_by_id)
references users(id);

create table audit.branch_custom_fields_history
(
  id bigint not null,
  rev integer not null
    constraint fk2la6llr960ua4evhp21iai002
      references audit.revinfo,
  revtype smallint,
  constraint branch_custom_fields_history_pkey
    primary key (id, rev)
);

alter table audit.branch_custom_fields_history owner to postgres;

create table audit.branch_custom_fields_values_history
(
  id bigint not null,
  rev integer not null
    constraint fk5g4aiwpbjk59u2f3t6anpgbkh
      references audit.revinfo,
  revtype smallint,
  status varchar(255),
  value varchar(255),
  verified_at timestamp,
  field_id bigint,
  verified_by_id bigint,
  owner_id bigint,
  constraint branch_custom_fields_values_history_pkey
    primary key (id, rev)
);

alter table audit.branch_custom_fields_values_history owner to postgres;