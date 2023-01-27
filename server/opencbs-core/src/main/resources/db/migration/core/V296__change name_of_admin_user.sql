update users set first_name = 'Administrator', last_name = '', username = 'Administrator' where id = 2;
alter table roles add column is_system boolean default false;
update roles set name = 'Administrator', is_system = true where id = 1;