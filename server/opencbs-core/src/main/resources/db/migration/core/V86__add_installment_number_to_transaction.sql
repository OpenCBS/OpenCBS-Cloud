alter table transactions
  add column installment_number integer;

alter table loan_applications
  alter column amount type decimal(12, 2);

alter table loans
  alter column amount type decimal(12, 2);

alter table loan_applications_payees
  alter column amount type decimal(12, 2);

alter table loan_products
  alter column amount_min type decimal(14, 2),
  alter column amount_max type decimal(14, 2);

alter table loan_applications_installments
  alter column interest type decimal(12, 2),
  alter column principal type decimal(12, 2),
  alter column olb type decimal(12, 2);

drop view loan_installments;

alter table loan_installment_logs
  alter column interest type decimal(12, 2),
  alter column principal type decimal(12, 2),
  alter column paid_interest type decimal(12, 2),
  alter column paid_principal type decimal(12, 2),
  alter column olb type decimal(12, 2);

alter table transactions
  alter column amount type decimal(12, 2);

create or replace view loan_installments as
  with loan_installment_with_rownum as (
      select
        lil.*,
        row_number()
        over (
          partition by lil.loan_id, number
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