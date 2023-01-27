alter table groups_members
    add join_date timestamp not null default now();

alter table groups_members
    add left_date timestamp;

alter table groups_members
    add column id bigserial primary key;