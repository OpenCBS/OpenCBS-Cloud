create table groups_members (
  group_id  integer not null,
  member_id integer not null
);

alter table groups_members
add constraint groups_members_group_id_fkey foreign key (group_id) references profiles (id);
alter table groups_members
add constraint groups_members_member_id_fkey foreign key (member_id) references profiles (id);