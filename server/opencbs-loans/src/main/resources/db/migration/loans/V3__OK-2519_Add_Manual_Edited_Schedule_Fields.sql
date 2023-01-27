ALTER TABLE loan_applications
    ADD schedule_manual_edited BOOLEAN NOT NULL DEFAULT FALSE,
    ADD schedule_manual_edited_at TIMESTAMP WITHOUT TIME ZONE,
    ADD schedule_manual_edited_by_id BIGINT;


ALTER TABLE loan_applications
ADD CONSTRAINT schedule_manual_edited_by_id_fkey
FOREIGN KEY (schedule_manual_edited_by_id) REFERENCES users(id);