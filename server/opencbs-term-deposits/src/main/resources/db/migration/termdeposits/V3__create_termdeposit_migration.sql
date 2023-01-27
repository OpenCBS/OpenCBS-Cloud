CREATE TABLE term_deposits (
  id                         BIGSERIAL PRIMARY KEY,
  code                       VARCHAR(32)   NOT NULL,
  profile_id                 BIGINT        NOT NULL REFERENCES profiles (id),
  term_deposit_product_id    BIGINT        NOT NULL REFERENCES term_deposit_products (id),
  interest_rate              DECIMAL(8, 4) NOT NULL,
  term_agreement             DECIMAL(8, 4) NOT NULL,
  interest_accrual_frequency VARCHAR(32)   NOT NULL,
  amount                     DECIMAL(14, 2),
  status                     VARCHAR(32)   NOT NULL,
  created_at                 TIMESTAMP     NOT NULL,
  open_date                  TIMESTAMP,
  close_date                 TIMESTAMP,
  reopen_date                TIMESTAMP,
  deposit_date               TIMESTAMP,
  created_by_id              BIGINT        NOT NULL REFERENCES users (id),
  opened_by_id               BIGINT REFERENCES users (id),
  closed_by_id               BIGINT REFERENCES users (id),
  reopened_by_id             BIGINT REFERENCES users (id),
  locked                     BOOLEAN       NOT NULL DEFAULT FALSE,
  service_officer_id         BIGINT        NOT NULL
);

CREATE TABLE term_deposit_accounts (
  id              BIGSERIAL PRIMARY KEY,
  type            VARCHAR(50) NOT NULL,
  term_deposit_id BIGINT      NOT NULL  REFERENCES term_deposits (id),
  account_id      BIGINT      NOT NULL  REFERENCES accounts (id)
);

CREATE TABLE term_deposit_accounting_entries (
  term_deposit_id     BIGINT NOT NULL REFERENCES term_deposits (id),
  accounting_entry_id BIGINT NOT NULL REFERENCES accounting_entries (id)
);

INSERT INTO global_settings
(name, type, value)
VALUES ('TERM_DEPOSIT_CODE_PATTERN', 'TEXT', '"TERM_DEPOSIT" + term_deposit_id')