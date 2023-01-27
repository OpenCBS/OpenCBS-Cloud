-- noinspection SqlNoDataSourceInspectionForFile
alter table loans_installments_history
  rename to loan_installment_logs;
drop table loans_installments;

alter table events
  add column deleted boolean not null default false;
alter table loan_installment_logs
  alter column paid_principal drop not null,
  alter column paid_interest drop not null;

create view loan_installments as
  with loan_installment_with_rownum as (
      select
        lil.*,
        row_number()
        over (
          partition by number
          order by created_at desc ) as rownum
      from loan_installment_logs lil inner join events e on lil.event_id = e.id
      where e.deleted = false
  )
  select
    id,
    number,
    maturity_date,
    interest,
    principal,
    paid_principal,
    paid_interest,
    olb,
    last_accrual_date,
    loan_id
  from loan_installment_with_rownum liwr
  where rownum = 1;