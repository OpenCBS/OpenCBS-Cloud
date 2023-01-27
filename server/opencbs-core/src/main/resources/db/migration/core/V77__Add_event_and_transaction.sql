CREATE TABLE events (
  id            BIGSERIAL PRIMARY KEY,
  event_type    VARCHAR(200) NOT NULL,
  created_at    TIMESTAMP    NOT NULL,
  created_by_id INTEGER      NOT NULL
);
ALTER TABLE events
  ADD CONSTRAINT events_created_by_id_fkey FOREIGN KEY (created_by_id) REFERENCES users (id) MATCH FULL;

CREATE TABLE transactions (
  id               BIGSERIAL PRIMARY KEY,
  event_id         INTEGER      NOT NULL,
  transaction_type VARCHAR(200) NOT NULL,
  amount           DECIMAL(12, 4)
);
ALTER TABLE transactions
  ADD CONSTRAINT transactions_event_id_fkey FOREIGN KEY (event_id) REFERENCES events (id) MATCH FULL;
