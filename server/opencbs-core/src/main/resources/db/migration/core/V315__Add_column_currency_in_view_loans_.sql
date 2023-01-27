drop view if exists view_loans;
create view view_loans
            (id, profile_name, amount, code, interest_rate, application_id, application_code, profile_type,
             loan_product_name, created_by, status, created_at, branch_name, currency, disbursement_date)
as
SELECT max(l.id)                                                    AS id,
       p.name                                                       AS profile_name,
       sum(l.amount)                                                AS amount,
       ''::character varying                                        AS code,
       l.interest_rate,
       a.id                                                         AS application_id,
       a.code                                                       AS application_code,
       p.type                                                       AS profile_type,
       product.name                                                 AS loan_product_name,
       (((u.first_name)::text || ' '::text) || (u.last_name)::text) AS created_by,
       l.status,
       max(l.created_at)                                            AS created_at,
       b.name                                                       AS branch_name,
       c.name                                                       AS currency,
       l.disbursement_date
FROM ((((((loans l
    LEFT JOIN loan_applications a ON ((l.loan_application_id = a.id)))
    LEFT JOIN currencies c ON ((c.id = l.currency_id)))
    LEFT JOIN profiles p ON ((a.profile_id = p.id)))
    LEFT JOIN loan_products product ON ((a.loan_product_id = product.id)))
    LEFT JOIN users u ON ((a.created_by_id = u.id)))
         LEFT JOIN branches b ON ((a.branch_id = b.id)))
GROUP BY a.id, p.id, product.id, u.id, l.status, b.id, l.interest_rate, c.name, l.disbursement_date
HAVING (((p.type)::text = 'GROUP'::text) AND ((a.status)::text <> 'PENDING'::text))
UNION ALL
SELECT l.id,
       p.name                                                       AS profile_name,
       l.amount,
       l.code,
       l.interest_rate,
       a.id                                                         AS application_id,
       a.code                                                       AS application_code,
       p.type                                                       AS profile_type,
       product.name                                                 AS loan_product_name,
       (((u.first_name)::text || ' '::text) || (u.last_name)::text) AS created_by,
       l.status,
       l.created_at,
       b.name                                                       AS branch_name,
       c.name                                                       AS currency,
       l.disbursement_date
FROM ((((((loans l
    LEFT JOIN loan_applications a ON ((l.loan_application_id = a.id)))
    LEFT JOIN currencies c ON ((c.id = l.currency_id)))
    LEFT JOIN profiles p ON ((a.profile_id = p.id)))
    LEFT JOIN loan_products product ON ((a.loan_product_id = product.id)))
    LEFT JOIN users u ON ((a.created_by_id = u.id)))
         LEFT JOIN branches b ON ((a.branch_id = b.id)))
WHERE (((p.type)::text <> 'GROUP'::text) AND ((a.status)::text <> 'PENDING'::text));

alter table view_loans
    owner to postgres;

