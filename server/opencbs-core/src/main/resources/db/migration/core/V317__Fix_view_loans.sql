drop view if exists view_loans;
create view view_loans as
(select
     max(l.id) as                       id,
     p.name                             profile_name,
     sum(l.amount)                      amount,
     '' as                              code,
     l.interest_rate                    interest_rate,
     a.id                               application_id,
     a.code                             application_code,
     p.type                             profile_type,
     product.name                       loan_product_name,
     u.first_name || ' ' || u.last_name created_by,
     l.status                           status,
     max(l.created_at)                  created_at,
     b.name                             branch_name,
     c.name                             currency,
     l.disbursement_date                disbursement_date
from loans l
         left join loan_applications a on l.loan_application_id = a.id
         left join currencies c on c.id = l.currency_id
         left join profiles p on a.profile_id = p.id
         left join loan_products product on a.loan_product_id = product.id
         left join users u on a.loan_officer_id = u.id
         left join branches b on a.branch_id = b.id
group by a.id, p.id, product.id, u.id, l.status, b.id, l.interest_rate, c.name, l.disbursement_date
having p.type = 'GROUP' and  a.status <> 'PENDING'
union all
select
    l.id,
    p.name                             profile_name,
    l.amount                           amount,
    l.code                             code,
    l.interest_rate                    interest_rate,
    a.id                               application_id,
    a.code                             application_code,
    p.type                             profile_type,
    product.name                       loan_product_name,
    u.first_name || ' ' || u.last_name created_by,
    l.status                           status,
    l.created_at                       created_at,
    b.name                             branch_name,
    c.name                             currency,
    l.disbursement_date                disbursement_date
from loans l
         left join loan_applications a on l.loan_application_id = a.id
         left join currencies c on c.id = l.currency_id
         left join profiles p on a.profile_id = p.id
         left join loan_products product on a.loan_product_id = product.id
         left join users u on a.loan_officer_id = u.id
         left join branches b on a.branch_id = b.id
where p.type <> 'GROUP' and  a.status <> 'PENDING')