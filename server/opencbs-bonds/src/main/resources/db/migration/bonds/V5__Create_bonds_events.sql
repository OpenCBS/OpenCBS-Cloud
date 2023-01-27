create table bonds_events (
    id                    bigserial                 primary key,
    event_type            varchar(200)              not null,
    created_at            timestamp                 not null,
    created_by_id         bigint                    not null,
    bond_id               bigint                    not null,
    effective_at          timestamp                 not null,
    deleted               boolean default false     not null,
    installment_number    integer,
    amount                numeric(12, 2) default 0  not null,
    group_key             bigint default 0          not null,
    comment               varchar(200),
    system                boolean default false     not null,
    rolled_back_by_id     bigint                    ,
    rolled_back_date      timestamp                 ,

    foreign key (created_by_id) references users (id),
    foreign key (bond_id) references bonds (id),
    foreign key (rolled_back_by_id) references users (id)
);

create table bonds_events_accounting_entries (
    id                    bigserial      primary key,
    bond_event_id         bigint         not null,
    accounting_entry_id   bigint         not null,
    unique (bond_event_id, accounting_entry_id),

    foreign key (bond_event_id) references bonds_events (id),
    foreign key (accounting_entry_id) references accounting_entries (id)
);

create sequence bond_events_group_key;