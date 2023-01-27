alter table loan_products
    add column early_partial_repayment_fee_type varchar(50),
    add column early_partial_repayment_fee_value numeric(12, 4),
    add column early_total_repayment_fee_type varchar(50),
    add column early_total_repayment_fee_value numeric(12, 4);

alter table audit.loan_products_history
    add column early_partial_repayment_fee_type varchar(50),
    add column early_partial_repayment_fee_value numeric(12, 4),
    add column early_total_repayment_fee_type varchar(50),
    add column early_total_repayment_fee_value numeric(12, 4);