alter table payees
    add column bill_of_sale_item boolean not null default false,
    alter column description drop not null;

alter table loan_applications_payees
    alter column description set not null;

