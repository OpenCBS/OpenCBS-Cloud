alter table users
  add column last_entry_time timestamp default (now() - interval '1 year');
update users
set last_entry_time = (now() - interval '1 year');

insert into
  system_settings (name, type, value)
values ('EXPIRATION_SESSION_TIME_IN_MINUTES', 'INTEGER', '5');