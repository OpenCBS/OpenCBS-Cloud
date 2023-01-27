create or replace function get_amount_in_eur_by_date(numeric, bigint, date) returns numeric
language plpgsql
as $$
declare
  amount alias for $1;
  currency_id alias for $2;
  exchange_date alias for $3;
  eur_id bigint;
begin
  select id from currencies where name = 'EUR' into eur_id;
  return case
         when currency_id = eur_id
           then amount
         else round(amount / (select rate from exchange_rates er where er.date = exchange_date and er.to_currency_id = currency_id),2)
         end;
end
$$
;