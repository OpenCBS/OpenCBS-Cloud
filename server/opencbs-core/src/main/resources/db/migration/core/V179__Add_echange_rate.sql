create table exchange_rates (
  id bigserial primary key,
  rate decimal(14,4),
  from_currency_id int not null,
  to_currency_id int not null,
  date timestamp without time zone not null
);

alter table exchange_rates
    add constraint exchange_rates_from_currency_id_fkey foreign key(from_currency_id) references currencies(id);

alter table exchange_rates
  add constraint exchange_rates_to_currency_id_fkey foreign key(to_currency_id) references currencies(id);

update currencies
set code = '840'
where name = 'USD';