create or replace view public.view_loans(id, profile_name, amount, code, interest_rate, application_id, application_code, profile_type, loan_product_name, created_by, status, created_at, branch_name, currency, disbursement_date, maturity_date) as
select max(l.id) as id,
       p.name as profile_name,
       sum(l.amount) as amount,
       ''::character varying as code,
       l.interest_rate,
       a.id as application_id,
       a.code as application_code,
       p.type as profile_type,
       product.name as loan_product_name,
       (((u.first_name)::text || ' '::text) || (u.last_name)::text) as created_by,
       l.status,
       max(l.created_at) as created_at,
       b.name as branch_name,
       c.name as currency,
       l.disbursement_date,
       l.maturity_date,
       l.loan_officer_id
from ((((((loans l
    left join loan_applications a on ((l.loan_application_id = a.id)))
    left join currencies c on ((c.id = l.currency_id)))
    left join profiles p on ((a.profile_id = p.id)))
    left join loan_products product on ((a.loan_product_id = product.id)))
    left join users u on ((a.loan_officer_id = u.id)))
         left join branches b on ((a.branch_id = b.id)))
group by a.id, p.id, product.id, u.id, l.status, b.id, l.interest_rate, c.name, l.disbursement_date, l.maturity_date, l.loan_officer_id
having (((p.type)::text = 'GROUP'::text) and ((a.status)::text <> 'PENDING'::text))
union all
select l.id,
       p.name as profile_name,
       l.amount,
       l.code,
       l.interest_rate,
       a.id as application_id,
       a.code as application_code,
       p.type as profile_type,
       product.name as loan_product_name,
       (((u.first_name)::text || ' '::text) || (u.last_name)::text) as created_by,
       l.status,
       l.created_at,
       b.name as branch_name,
       c.name as currency,
       l.disbursement_date,
       l.maturity_date,
       l.loan_officer_id
from ((((((loans l
    left join loan_applications a on ((l.loan_application_id = a.id)))
    left join currencies c on ((c.id = l.currency_id)))
    left join profiles p on ((a.profile_id = p.id)))
    left join loan_products product on ((a.loan_product_id = product.id)))
    left join users u on ((a.loan_officer_id = u.id)))
         left join branches b on ((a.branch_id = b.id)))
where (((p.type)::text <> 'GROUP'::text) and ((a.status)::text <> 'PENDING'::text));

alter table public.view_loans owner to postgres;