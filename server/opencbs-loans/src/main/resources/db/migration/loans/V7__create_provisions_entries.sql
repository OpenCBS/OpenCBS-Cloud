create table loan_product_provisions (
  id bigserial primary key,
  loan_product_id bigint
  references loan_products(id),
  late_of_days bigint not null,
  provision_by_principal numeric(12,4),
  provision_by_interest numeric(12,4),
  provision_by_penalty numeric(12,4)
);
create index loan_product_id_index on loan_product_provisions(loan_product_id);

alter table loan_products_accounts alter column account_id drop not null;

do
$$
declare
  _default_day_closure_date date := now();
begin
  insert into loan_products_accounts(type, loan_product_id, account_id)
    select type, loan_product_id, null::bigint from (
                    select 'LOAN_LOSS_RESERVE' as type, lp.id loan_product_id from loan_products lp
                    union all
                    select 'PROVISION_ON_PRINCIPAL', lp.id from loan_products lp
                    union all
                    select 'PROVISION_REVERSAL_ON_PRINCIPAL', lp.id from loan_products lp
                    union all
                    select 'LOAN_LOSS_RESERVE_INTEREST', lp.id from loan_products lp
                    union all
                    select 'PROVISION_ON_INTERESTS', lp.id from loan_products lp
                    union all
                    select 'PROVISION_REVERSAL_ON_INTERESTS', lp.id from loan_products lp
                    union all
                    select 'LOAN_LOSS_RESERVE_PENALTIES', lp.id from loan_products lp
                    union all
                    select 'PROVISION_ON_LATE_FEES', lp.id from loan_products lp
                    union all
                    select 'PROVISION_REVERSAL_ON_LATE_FEES', lp.id from loan_products lp
                  ) t;


  insert into day_closure_contracts(contract_id, process_type, actual_date)
    select l.id, 'LOAN_PROVISION', coalesce((select max(day) from day_closures), _default_day_closure_date) from loans l;

end;
$$