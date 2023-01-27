create table bonds_accounts (
  id                bigserial   primary key,
  type              varchar(50) not null,
  bond_id           bigint     not null references bonds (id),
  account_id        bigint     not null references accounts (id)
);