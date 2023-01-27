create table borrowing_accounts (
  id                bigserial    primary key,
  type              varchar(255) not null,
  borrowing_id      integer      not null references borrowings (id),
  account_id        integer      not null references accounts (id)
);