-- noinspection SqlNoDataSourceInspectionForFile
create table loans_installments (
  id                  bigserial      primary key,
  number              integer        not null,
  maturity_date       date           not null,
  interest            decimal(14, 4) not null,
  principal           decimal(14, 4) not null,
  olb                 decimal(14, 4) not null,
  last_accrual_date   date           not null,
  loan_id             integer        not null
);
alter table loans_installments
  add constraint loans_installments_loan_id_fkey
foreign key (loan_id) references loans (id) match full;