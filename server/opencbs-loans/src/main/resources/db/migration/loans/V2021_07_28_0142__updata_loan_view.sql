drop view if exists view_loans;
create view view_loans
            (id, profile_name, amount, code, interest_rate, application_id, application_code, profile_type,
             loan_product_name, created_by, status, created_at, branch_name, currency, disbursement_date, maturity_date,
             loan_officer_id, credit_line_name, profile_id, outstanding_amount)
as
select t.*
     ,case
          when t.credit_line_name is not null then
              (
                          (select committed_amount from credit_lines where name = t.credit_line_name)
                          -
                          (
                              select sum(la.amount) from loan_applications la
                                                             join credit_lines cl on la.credit_line_id = cl.id
                              where la.profile_id = t.profile_id
                                and cl.name = t.credit_line_name
                          )
                      +
                          (
                              select coalesce(sum(le.amount),0) from loans_events le
                                                                         join loans on loans.id = le.loan_id
                                                                         join loan_applications la on loans.loan_application_id = la.id
                                                                         join credit_lines cl on la.credit_line_id = cl.id
                              where event_type in ('REPAYMENT_OF_PRINCIPAL', 'WRITE_OFF_OLB')
                                and le.deleted is false
                                and loans.profile_id = t.profile_id
                          )
                  )
    end outstanding_amount
from (
         SELECT max(l.id)                                              AS id,
                p.name                                                 AS profile_name,
                sum(l.amount)                                          AS amount,
                ''::character varying                                  AS code,
                l.interest_rate,
                a.id                                                   AS application_id,
                a.code                                                 AS application_code,
                p.type                                                 AS profile_type,
                product.name                                           AS loan_product_name,
                (u.first_name::text || ' '::text) || u.last_name::text AS created_by,
                l.status,
                max(l.created_at)                                      AS created_at,
                b.name                                                 AS branch_name,
                c.name                                                 AS currency,
                l.disbursement_date,
                l.maturity_date,
                l.loan_officer_id,
                cl.name                                                  AS credit_line_name,
                p.id                                                     AS profile_id
         FROM loans l
                  LEFT JOIN loan_applications a ON l.loan_application_id = a.id
                  LEFT JOIN currencies c ON c.id = l.currency_id
                  LEFT JOIN profiles p ON a.profile_id = p.id
                  LEFT JOIN loan_products product ON a.loan_product_id = product.id
                  LEFT JOIN users u ON a.loan_officer_id = u.id
                  LEFT JOIN branches b ON a.branch_id = b.id
                  LEFT JOIN credit_lines cl on a.credit_line_id = cl.id
         GROUP BY a.id, p.id, product.id, u.id, l.status, b.id, l.interest_rate, c.name, l.disbursement_date, l.maturity_date,
                  l.loan_officer_id, cl.name
         HAVING p.type::text = 'GROUP'::text
            AND a.status::text <> 'PENDING'::text
         UNION ALL
         SELECT l.id,
                p.name                                                 AS profile_name,
                l.amount,
                l.code,
                l.interest_rate,
                a.id                                                   AS application_id,
                a.code                                                 AS application_code,
                p.type                                                 AS profile_type,
                product.name                                           AS loan_product_name,
                (u.first_name::text || ' '::text) || u.last_name::text AS created_by,
                l.status,
                l.created_at,
                b.name                                                 AS branch_name,
                c.name                                                 AS currency,
                l.disbursement_date,
                l.maturity_date,
                l.loan_officer_id,
                cl.name                                                  AS credit_line_name,
                p.id                                                     AS profile_id
         FROM loans l
                  LEFT JOIN loan_applications a ON l.loan_application_id = a.id
                  LEFT JOIN currencies c ON c.id = l.currency_id
                  LEFT JOIN profiles p ON a.profile_id = p.id
                  LEFT JOIN loan_products product ON a.loan_product_id = product.id
                  LEFT JOIN users u ON a.loan_officer_id = u.id
                  LEFT JOIN branches b ON a.branch_id = b.id
                  LEFT JOIN credit_lines cl on a.credit_line_id = cl.id
         WHERE p.type::text <> 'GROUP'::text
           AND a.status::text <> 'PENDING'::text
     ) t;

alter table view_loans
    owner to postgres;
