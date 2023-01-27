-- noinspection SqlNoDataSourceInspectionForFile
alter table loan_products add availability integer not null default(3);

drop table availabilities;

insert into currencies (name) values ('USD');

alter table loan_products add constraint loan_products_currency_id_fkey foreign key (currency_id) references currencies(id);
