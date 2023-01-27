-- noinspection SqlNoDataSourceInspectionForFile
create table collaterals (
  id            bigserial primary key,
  name          varchar(255) not null,
  created_by_id bigint       not null
);

alter table collaterals
  add constraint collateral_created_by_id_fkey foreign key (created_by_id) references users (id);