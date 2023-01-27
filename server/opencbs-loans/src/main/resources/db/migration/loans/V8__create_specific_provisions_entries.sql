create table loan_specific_provisions (
  id bigserial primary key,
  loan_id bigint references loans(id),
  provision_type varchar(50) null,
  value numeric(12,4)
);
create index loan_specific_provisions_loan_product_id_index on loan_specific_provisions(loan_id);