ALTER TABLE IF EXISTS sepa_documents
    ADD COLUMN IF NOT EXISTS doc_status VARCHAR(100) NOT NULL DEFAULT 'EXPORTED';

UPDATE sepa_documents SET doc_status = 'EXPORTED' WHERE document_status = 0;
UPDATE sepa_documents SET doc_status = 'UPLOADED' WHERE document_status = 1;
UPDATE sepa_documents SET doc_status = 'REPAID' WHERE document_status = 2;
UPDATE sepa_documents SET doc_status = 'FAILED' WHERE document_status = 3;

ALTER TABLE IF EXISTS sepa_documents
    DROP COLUMN IF EXISTS document_status;
ALTER TABLE IF EXISTS sepa_documents
    RENAME COLUMN doc_status TO document_status;