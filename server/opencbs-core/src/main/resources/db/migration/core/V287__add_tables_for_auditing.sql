create table if not exists audit.companies_attachments_history
(
  id bigserial not null
    constraint companies_attachments_history_pkey
    primary key,
  owner_id bigint not null,
  filename varchar(255) not null,
  content_type varchar(255) not null,
  pinned boolean default false not null,
  created_at timestamp not null,
  created_by_id bigint not null,
  original_filename varchar(255),
  comment varchar(280),
  rev integer not null,
  revtype smallint
);

create table if not exists audit.companies_custom_fields_values_history
(
  id bigint not null,
  rev integer not null,
  revtype smallint,
  owner_id bigint,
  constraint companies_custom_fields_values_history_pkey
  primary key (id, rev)
);

create table if not exists audit.companies_members_history
(
  id bigint not null,
  rev integer not null,
  revtype smallint,
  join_date timestamp,
  left_date timestamp,
  company_id bigint,
  member_id bigint,
  constraint companies_members_history_pkey
  primary key (id, rev)
);

create table if not exists audit.company_company_member_history
(
  rev integer not null,
  company_id bigint not null,
  id bigint not null,
  revtype smallint,
  constraint company_company_member_history_pkey
  primary key (rev, company_id, id)
);

create table if not exists audit.group_group_member_history
(
  rev integer not null,
  group_id bigint not null,
  id bigint not null,
  revtype smallint,
  constraint group_group_member_history_pkey
  primary key (rev, group_id, id)
);

create table if not exists audit.groups_attachments_history
(
  id bigint not null,
  rev integer not null,
  revtype smallint,
  constraint groups_attachments_history_pkey
  primary key (id, rev)
);

create table if not exists audit.groups_custom_fields_values_history
(
  id bigint not null,
  rev integer not null,
  revtype smallint,
  owner_id bigint,
  constraint groups_custom_fields_values_history_pkey
  primary key (id, rev)
);

create table if not exists audit.groups_members_history
(
  id bigint not null,
  rev integer not null,
  revtype smallint,
  join_date timestamp,
  left_date timestamp,
  group_id bigint,
  member_id bigint,
  constraint groups_members_history_pkey
  primary key (id, rev)
);

create table if not exists audit.people_attachments_history
(
  id bigint not null,
  rev integer not null,
  revtype smallint,
  constraint people_attachments_history_pkey
  primary key (id, rev)
);

create table if not exists audit.people_custom_fields_values_history
(
  id bigint not null,
  rev integer not null,
  revtype smallint,
  owner_id bigint,
  constraint people_custom_fields_values_history_pkey
  primary key (id, rev)
);

create table if not exists audit.profiles_accounts_history
(
  rev integer not null,
  profile_id bigint not null,
  account_id bigint not null,
  revtype smallint,
  constraint profiles_accounts_history_pkey
  primary key (rev, profile_id, account_id)
);

create table if not exists audit.profiles_history
(
  id bigint not null,
  rev integer not null,
  type varchar(31) not null,
  revtype smallint,
  name varchar(255),
  status varchar(255),
  version integer,
  constraint profiles_history_pkey
  primary key (id, rev)
);