create table loans_history (
  id            bigserial      primary key,
  loan_id       integer        not null references loans,
  event_id      integer        not null references loans_events,
  amount        numeric(12, 2) not null,
  interest_rate numeric(8, 4)  not null
);