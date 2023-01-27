create table branch_payment_methods (
  branch_id         bigint not null,
  payment_method_id bigint not null,
  primary key (branch_id, payment_method_id)
);

alter table branch_payment_methods
  add constraint branch_payment_methods_branch_id_fkey foreign key (branch_id) references branches (id);

alter table branch_payment_methods
  add constraint branch_payment_methods_payment_method_id_fkey foreign key (payment_method_id) references payment_methods (id);