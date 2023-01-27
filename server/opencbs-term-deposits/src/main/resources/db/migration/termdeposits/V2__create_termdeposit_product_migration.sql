CREATE TABLE term_deposit_products
(
  id                         BIGSERIAL      NOT NULL PRIMARY KEY,
  name                       VARCHAR(200)   NOT NULL UNIQUE,
  code                       VARCHAR(32)    NOT NULL UNIQUE,
  availability               INT            NOT NULL,
  currency_id                BIGINT         NOT NULL REFERENCES currencies (id),
  amount_min                 DECIMAL(14, 2) NOT NULL,
  amount_max                 DECIMAL(14, 2) NOT NULL,
  interest_rate_min          DECIMAL(8, 4)  NOT NULL,
  interest_rate_max          DECIMAL(8, 4)  NOT NULL,
  term_agreement_min         DECIMAL(8, 4)  NOT NULL,
  term_agreement_max         DECIMAL(8, 4)  NOT NULL,
  interest_accrual_frequency VARCHAR(32)    NOT NULL
);

CREATE TABLE term_deposit_product_accounts
(
  id                      BIGSERIAL   NOT NULL PRIMARY KEY,
  type                    VARCHAR(50) NOT NULL,
  term_deposit_product_id BIGINT      NOT NULL  REFERENCES term_deposit_products (id),
  account_id              BIGINT      NOT NULL  REFERENCES accounts (id)
);

