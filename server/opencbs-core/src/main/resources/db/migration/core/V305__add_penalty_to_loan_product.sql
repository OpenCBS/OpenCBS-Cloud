create table loan_products_penalties (
  loan_product_id bigint not null references loan_products (id),
  penalty_id    bigint not null references penalties(id)
);

alter table loan_products
drop column penalty_to_loan_amount,
drop column penalty_to_olb,
drop column penalty_to_overdue_interest,
drop column penalty_to_overdue_principal;
