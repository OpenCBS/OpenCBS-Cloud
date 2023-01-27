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