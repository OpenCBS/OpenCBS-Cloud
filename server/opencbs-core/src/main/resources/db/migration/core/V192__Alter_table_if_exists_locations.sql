alter table if exists locations
   drop constraint if exists locations_name_key;

alter table if exists locations
   add constraint locations_name_and_parent_key unique (name, parent_id);

alter table if exists professions
    drop constraint if exists professions_name_key;

alter table if exists professions
   add constraint professions_name_and_parent_key unique (name, parent_id);

alter table if exists loan_purposes
    drop constraint if exists loan_purposes_name_key;

alter table if exists loan_purposes
   add constraint loan_purposes_name_and_parent_key unique (name, parent_id);

alter table if exists business_sectors
    drop constraint if exists business_sectors_name_key;

alter table if exists business_sectors
   add constraint business_sectors_name_and_parent_key unique (name, parent_id);