alter table other_fees
  rename column account_id to charge_account_id;

alter table other_fees
rename constraint other_fees_account_id_fkey to other_fees_charge_account_id_fkey;

alter table other_fees add column income_account_id integer not null references accounts(id);

alter table other_fees add column expense_account_id integer not null  references accounts(id);

alter table other_fees add constraint unique_other_fee_name unique(name);