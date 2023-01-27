-- noinspection SqlNoDataSourceInspectionForFile
alter table entry_fees
  alter column min_value set default 0;

alter table entry_fees
  alter column is_percentage set default true;

alter table entry_fees
  alter column upper_limit drop not null;