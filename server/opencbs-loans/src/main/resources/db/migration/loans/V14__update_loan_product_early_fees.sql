update loan_products
set early_partial_repayment_fee_type = 'RECEIVED_AMOUNT'
where early_partial_repayment_fee_type = 'AMOUNT_DUE';

update loan_products
set early_total_repayment_fee_type = 'RECEIVED_AMOUNT'
where early_total_repayment_fee_type = 'AMOUNT_DUE';

update audit.loan_products_history
set early_partial_repayment_fee_type = 'RECEIVED_AMOUNT'
where early_partial_repayment_fee_type = 'AMOUNT_DUE';

update audit.loan_products_history
set early_total_repayment_fee_type = 'RECEIVED_AMOUNT'
where early_total_repayment_fee_type = 'AMOUNT_DUE';