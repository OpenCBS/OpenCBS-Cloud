alter table accounting_entries_tills
  drop constraint accounting_entries_tills_initiated_by_fkey;
alter table accounting_entries_tills
  add constraint accounting_entries_tills_initiated_by_fkey
foreign key (initiated_by) references profiles (id) match simple;

alter table accounting_entries_tills
  alter column initiated_by drop not null;