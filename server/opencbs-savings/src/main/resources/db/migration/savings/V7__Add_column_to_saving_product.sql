alter table saving_products
    add column min_balance decimal(14, 2);

update saving_products
set
  min_balance = 5000;