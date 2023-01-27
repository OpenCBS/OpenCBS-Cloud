create table payment_methods (
    id          bigserial         primary key,
    name        varchar(255)      not null,
    parent_id   bigint            null
);

alter table payment_methods
    add constraint payment_methods_name_key unique (name);

alter table payment_methods
    add constraint payment_methods_parent_id_fkey foreign key (parent_id) references payment_methods (id);