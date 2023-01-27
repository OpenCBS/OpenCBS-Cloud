alter table audit.groups_attachments_history add column owner_id bigint;
alter table audit.people_attachments_history add column owner_id bigint;

alter table audit.people_custom_fields_values_history
  add column status varchar(255),
  add column value varchar(255),
  add column verified_at timestamp,
  add column field_id bigint,
  add column verified_by_id bigint;

alter table audit.groups_custom_fields_values_history
  add column status varchar(255),
  add column value varchar(255),
  add column verified_at timestamp,
  add column field_id bigint,
  add column verified_by_id bigint;

alter table audit.companies_custom_fields_values_history
  add column status varchar(255),
  add column value varchar(255),
  add column verified_at timestamp,
  add column field_id bigint,
  add column verified_by_id bigint;

create table audit.groups_custom_fields_history
(
  id bigint not null,
  rev integer not null references audit.revinfo,
  revtype smallint,
  constraint groups_custom_fields_history_pkey
  primary key (id, rev)
);

create table audit.people_custom_fields_history
(
  id bigint not null,
  rev integer not null references audit.revinfo,
  revtype smallint,
  constraint people_custom_fields_history_pkey
  primary key (id, rev)
);

create table audit.companies_custom_fields_history
(
  id bigint not null,
  rev integer not null references audit.revinfo,
  revtype smallint,
  constraint companies_custom_fields_history_pkey
  primary key (id, rev)
);

alter table audit.users_history add column role_id bigint;
