create table if not exists credit_lines(
    id                                  bigserial primary key,
    name                                varchar(255) not null,
    profile_id                          bigint not null,
    start_date                          date not null,
    last_disbursement_date              date,
    maturity_date                       date not null,
    committed_amount                    numeric(14, 4)  not null,
    disbursement_amount_min             numeric(14, 4)  not null,
    disbursement_amount_max             numeric(14, 4)  not null,
    loan_product_id                     bigint,
    interest_rate_min                   numeric(8, 4) not null,
    interest_rate_max                   numeric(8, 4) not null,
    structuring_fees                    numeric(14, 4) not null,
    entry_fees                          numeric(14, 4) not null,
    early_partial_repayment_fee_value   numeric(14, 4) not null,
    early_partial_repayment_fee_type    varchar(255) not null,
    early_total_repayment_fee_value     numeric(14, 4) not null,
    early_total_repayment_fee_type      varchar(255) not null
);

alter table credit_lines
    add constraint credit_lines_profile_id_fkey foreign key (profile_id) references profiles (id) match full;

alter table credit_lines
    add constraint  credit_lines_loan_product_id_fkey foreign key (loan_product_id) references loan_products (id) match full;

create table if not exists credit_lines_penalties(
    credit_line_id          bigint not null,
    penalty_id              bigint not null
);

alter table credit_lines_penalties
    add constraint  credit_lines_penalties_credit_line_id_fkey foreign key (credit_line_id) references credit_lines (id) match full;

alter table credit_lines_penalties
    add constraint credit_lines_penalties_penalty_id_fkey foreign key (penalty_id) references penalties (id) match full;

alter table loan_applications
    add column credit_line_id bigint;

alter table loan_applications
    add constraint loan_applications_credit_line_id_fkey foreign key (credit_line_id) references credit_lines (id) match full;