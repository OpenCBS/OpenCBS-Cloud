alter table users
  add column is_system_user boolean default false;

update users set id = 2 where id = 1;
insert into users (id, username, first_name, last_name, password_hash, is_system_user)
  values (1, 'SYSTEM', 'SYSTEM', 'SYSTEM', '$2a$10$tZ5qmuDH3Dql3cXrRiE1TuhaG/GHg8XNMBcafImQHWzcYuPEqBg3y', true);
SELECT setval('users_id_seq', (SELECT max(id)
                               FROM users));