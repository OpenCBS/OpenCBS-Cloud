create schema if not exists chat;

create table if not exists chat.messages (
  id bigserial primary key,
  user_id bigint not null
    constraint messages_users_fkey
    references users,
  created_at timestamp,
  type varchar(50),
  object_id bigint,
  payload TEXT
)