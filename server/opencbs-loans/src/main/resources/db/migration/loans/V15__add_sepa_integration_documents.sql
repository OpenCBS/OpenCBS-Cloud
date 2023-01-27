CREATE TABLE IF NOT EXISTS sepa_documents(
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE,
    created_by BIGINT REFERENCES users (id) ON UPDATE CASCADE ON DELETE NO ACTION,
    document_type INTEGER NOT NULL DEFAULT 0,
    uid VARCHAR(50) NOT NULL,
    generated_for_date DATE NOT NULL DEFAULT now(),
    number_of_taxes INTEGER NOT NULL DEFAULT 0,
    control_sum DECIMAL NOT NULL DEFAULT 0,
    document_status INTEGER
);