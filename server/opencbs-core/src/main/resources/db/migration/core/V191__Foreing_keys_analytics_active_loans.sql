-- CHANGE COLUMNS AS FOREIGN KEYS --
begin;

-- Loan ID --
alter table analytics_active_loans
  add constraint loan_id_fkey
  foreign key (loan_id)
  references loans(id);

-- Profile ID --
alter table analytics_active_loans
  add constraint profile_id_fkey
  foreign key (profile_id)
  references profiles(id);

-- Loan Product ID --
alter table analytics_active_loans
  add constraint loan_product_id_fkey
  foreign key (loan_product_id)
  references loan_products(id);

-- Loan Product Currency ID --
alter table analytics_active_loans
  add constraint loan_products_currency_id_fkey
  foreign key (loan_products_currency_id)
  references currencies(id);


-- Loan Officer ID --
alter table analytics_active_loans
  add constraint loan_officer_id_fkey
  foreign key (loan_officer_id)
  references users(id);

-- Branch ID --
alter table analytics_active_loans
  add constraint branch_id_fkey
  foreign key (branch_id)
  references branches(id);

-- Next Repayment ID --
alter table analytics_active_loans
  add constraint next_repayment_id_fkey
  foreign key (next_repayment_id)
  references loans_installments(id);

commit;
