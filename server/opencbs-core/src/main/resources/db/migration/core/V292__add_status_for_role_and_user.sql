alter table roles add column status varchar(10) not null default 'ACTIVE';
alter table audit.roles_history add column status varchar(10);

alter table users add column status varchar(10) not null default 'ACTIVE';
alter table audit.users_history add column status varchar(10);