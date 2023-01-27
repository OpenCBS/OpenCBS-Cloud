alter table profiles
  add column status varchar(250);

update profiles
set status = 'LIVE';

alter table profiles
  alter column status set not null;