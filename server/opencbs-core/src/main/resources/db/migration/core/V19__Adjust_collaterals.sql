-- noinspection SqlNoDataSourceInspectionForFile
alter table collaterals
  add constraint collaterals_name_key unique (name);
alter table collaterals
  rename constraint collateral_created_by_id_fkey to collaterals_created_by_id_fkey;

alter table collaterals_custom_fields_types
  add constraint collaterals_caption_key unique (caption);