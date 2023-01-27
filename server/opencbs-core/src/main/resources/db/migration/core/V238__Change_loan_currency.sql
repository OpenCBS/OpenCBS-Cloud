-- Extend loan products

alter table loan_products
  alter column currency_id drop not null;

alter table loan_products
  alter column schedule_type drop not null;

-- Extend loan loan applications

alter table loan_applications
  add column currency_id bigint references currencies;

update loan_applications
set currency_id = p.currency_id
from (select
        id, currency_id
      from
        loan_products) as p
where
  loan_applications.loan_product_id = p.id;

alter table loan_applications
  alter column currency_id set not null;

-- Extend loans

alter table loans
  add column currency_id bigint references currencies;

update loans
set currency_id = lp.currency_id
from (select
        id, currency_id
      from
        loan_applications) as lp
where
  loans.loan_application_id = lp.id;

alter table loans
  alter column currency_id set not null;