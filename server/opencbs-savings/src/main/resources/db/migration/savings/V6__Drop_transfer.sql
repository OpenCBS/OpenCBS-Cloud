alter table savings
    drop column transfer_amount_max;

alter table savings
    drop column transfer_amount_min;

alter table savings
    drop column transfer_fee_rate;

alter table savings
    drop column transfer_fee_flat;

alter table saving_products
    drop column transfer_amount_min;

alter table saving_products
    drop column transfer_amount_max;

alter table saving_products
    drop column transfer_fee_flat_max;

alter table saving_products
    drop column transfer_fee_flat_min;

alter table saving_products
    drop column transfer_fee_rate_max;

alter table saving_products
    drop column transfer_fee_rate_min;