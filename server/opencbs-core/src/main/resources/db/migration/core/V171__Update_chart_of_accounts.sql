update accounts
set type = 3
where id in (select distinct parent_id
             from accounts
             where type = 5);

update accounts
set type = 4
where
type = 5;