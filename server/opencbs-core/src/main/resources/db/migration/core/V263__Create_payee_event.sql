drop table if exists payees_events;
create table payees_events
(
    id                         bigserial primary key,
    event_type                 varchar(255)             not null,
    created_at                 timestamp                not null,
    created_by_id              bigint                   not null references users (id),
    loan_applications_payee_id bigint                   not null references loan_applications_payees (id),
    deleted                    boolean default false    not null,
    effective_at               timestamp                not null,
    amount                     numeric(12, 2) default 0 not null,
    group_key                  bigint default 0         not null,
    check_number               varchar(255),
    rolled_back_by_id          bigint                   references users (id),
    rolled_back_date           timestamp,
    description                varchar(255),
    system                     boolean default false
);

create sequence payees_event_group_key;