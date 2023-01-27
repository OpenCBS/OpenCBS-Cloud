-- noinspection SqlNoDataSourceInspectionForFile
create table collaterals_custom_fields_types (
  id            bigserial primary key,
  caption       varchar(255) not null,
  collateral_id bigint       not null,
  "order"       int          not null default (0)
);

create table collaterals_custom_fields (
  id          bigserial primary key,
  section_id  bigint       not null,
  name        varchar(255) not null,
  field_type  varchar(31)  not null,
  caption     varchar(255) not null,
  is_unique   boolean      not null default false,
  is_required boolean      not null default false,
  "order"     int          not null default (0),
  extra       text         null
);

alter table collaterals_custom_fields
  add constraint collaterals_custom_fields_types_id_fkey foreign key (section_id) references collaterals_custom_fields_types (id);

create table collaterals_custom_fields_values (
  id       bigserial primary key,
  owner_id bigint not null,
  field_id bigint not null,
  value    text   null
);

alter table collaterals_custom_fields_values
  add constraint collaterals_custom_fields_values_owner_id_fkey foreign key (owner_id) references collaterals (id);

alter table collaterals_custom_fields_values
  add constraint collaterals_custom_fields_values_field_id_fkey foreign key (field_id) references collaterals_custom_fields (id);