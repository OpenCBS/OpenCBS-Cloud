create table credit_committee_roles (
    id bigserial primary key,
    credit_committee_amount_range_id integer not null,
    role_id integer not null
);
alter table credit_committee_roles
    add constraint credit_committee_roles_credit_committee_amount_range_id_fkey foreign key (credit_committee_amount_range_id) references credit_committee_amount_range(id);
alter table credit_committee_roles
    add constraint credit_committee_roles_role_id foreign key (role_id) references roles(id);