-- noinspection SqlNoDataSourceInspectionForFile
create table loan_products_entry_fees (
  loan_product_id integer not null,
  entry_fee_id    integer not null
);

alter table loan_products_entry_fees
  add constraint loan_products_entry_fees_loan_product_id_fkey
foreign key (loan_product_id) references loan_products (id) match full;

alter table loan_products_entry_fees
  add constraint loan_products_entry_fees_entry_fee_id_fkey
foreign key (entry_fee_id) references entry_fees (id) match full;