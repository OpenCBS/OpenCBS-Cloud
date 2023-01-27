alter table guarantors
  add column created_at timestamp without time zone null;

alter table guarantors
  add column created_by_id bigint not null default 1;

alter table guarantors
  add constraint guarantors_created_by_id_fkey foreign key (created_by_id) references users (id);

alter table guarantors
  add column closed_at timestamp without time zone null;

alter table guarantors
  add column closed_by_id bigint null default 1;

alter table guarantors
  add constraint guarantors_closed_by_id_fkey foreign key (closed_by_id) references users (id);

--------------------------------------------------------------

alter table collaterals
  add column created_at timestamp without time zone null;

alter table collaterals
  add column closed_at timestamp without time zone null;

alter table collaterals
  add column closed_by_id bigint null default 1;

alter table collaterals
  add constraint collaterals_closed_by_id_fkey foreign key (closed_by_id) references users (id);