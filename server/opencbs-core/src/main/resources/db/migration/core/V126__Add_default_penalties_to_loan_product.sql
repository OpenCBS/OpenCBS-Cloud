alter table loan_products
  drop column penalty_type;
alter table loan_products
  add column loan_amount decimal,
  add column olb decimal,
  add column overdue_principal decimal,
  add column overdue_interest decimal;

alter table loans
  add column loan_amount decimal,
  add column olb decimal,
  add column overdue_principal decimal,
  add column overdue_interest decimal;

alter table loan_applications
  add column loan_amount decimal,
  add column olb decimal,
  add column overdue_principal decimal,
  add column overdue_interest decimal;

insert into global_settings(name, type, "value")
values ('PENALTY_ACCRUAL', 'TEXT', 'standardPenaltyCalculationService')