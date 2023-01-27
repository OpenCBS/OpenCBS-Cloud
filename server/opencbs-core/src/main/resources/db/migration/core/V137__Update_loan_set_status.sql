alter table loans
  add column status varchar(100);

update loans
set status = 'ACTIVE';

alter table loans
  alter column status set not null;