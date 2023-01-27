alter TABLE collaterals add column type_of_collateral_id integer not null;
alter table collaterals add constraint collaterals_type_of_collateral_id_fkey foreign key(type_of_collateral_id) references types_of_collateral (id) match full;
alter table collaterals drop constraint collaterals_name_key;