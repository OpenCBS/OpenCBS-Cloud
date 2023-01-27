alter table borrowings
  add column correspondence_account_id integer not null;

alter table borrowings
  add foreign key (correspondence_account_id) references accounts(id);