create table import_payment_history
(

    id               bigserial               not null
        constraint import_payment_history_pkey
            primary key,
    created_at       timestamp default now() not null,
    payment_date     timestamp               not null,
    partner_name     varchar(255)            not null,
    contract_number  varchar(255)            not null,
    repayment_amount numeric(12, 2)          not null,
    formatted_number varchar(20),
    customer_name    varchar(255),
    is_uploaded      boolean   default false not null

)