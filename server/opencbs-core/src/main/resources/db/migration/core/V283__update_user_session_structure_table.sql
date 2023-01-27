alter table user_sessions
  add column user_name varchar(250),
  add column login_action_type varchar(250),
  add column login_status_type varchar(250);

alter table user_sessions
  drop column if exists user_id;