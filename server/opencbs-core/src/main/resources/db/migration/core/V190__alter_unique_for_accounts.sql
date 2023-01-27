alter table accounts drop constraint "accounts_number_key";
create unique index accounts_number_key on accounts (number, currency_id, branch_id);