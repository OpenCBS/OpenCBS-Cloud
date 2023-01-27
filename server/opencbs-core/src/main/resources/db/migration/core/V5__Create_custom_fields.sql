-- noinspection SqlNoDataSourceInspectionForFile
create table custom_fields (
  id bigserial primary key,
  owner_type varchar(20) not null,
  field_type varchar(20) not null,
  caption varchar(255) not null,
  "unique" boolean not null,
  required boolean not null,
  "order" integer not null,
  extra text null
);

create table custom_field_values (
  id bigserial primary key,
  owner_type varchar(20) not null,
  "value" text null,
  field_id bigint not null,
  owner_id bigint not null
);

alter table custom_field_values
add constraint fk_custom_field_values_field_id
foreign key (field_id)
references custom_fields(id);
