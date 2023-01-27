alter table loan_products add column top_up_allow boolean not null default false;
alter table loan_products add column top_up_max_limit numeric(14, 2) null;
alter table loan_products add column top_up_max_olb numeric(14, 2) null;