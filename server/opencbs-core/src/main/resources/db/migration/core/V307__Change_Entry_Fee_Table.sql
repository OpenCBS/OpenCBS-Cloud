ALTER TABLE entry_fees
RENAME upper_limit TO max_limit;
ALTER TABLE entry_fees
ADD min_limit NUMERIC(12, 4);

UPDATE entry_fees
SET min_limit = max_limit;