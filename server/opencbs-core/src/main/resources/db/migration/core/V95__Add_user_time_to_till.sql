ALTER TABLE tills
  ADD COLUMN changed_by_id INTEGER,
  ADD COLUMN open_date TIMESTAMP,
  ADD COLUMN close_date TIMESTAMP;

ALTER TABLE tills
  ADD CONSTRAINT tills_created_by_id_fkey FOREIGN KEY (changed_by_id) REFERENCES users (id) MATCH FULL;