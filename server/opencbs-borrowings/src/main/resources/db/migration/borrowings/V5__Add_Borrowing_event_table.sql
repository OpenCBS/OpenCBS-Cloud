create table borrowing_events (
    id                 bigserial primary key,
    event_type         varchar(200)             not null,
    created_at         timestamp                not null,
    created_by_id      integer                  not null,
    borrowing_id  integer                  not null,
    deleted            boolean default false    not null,
    effective_at       timestamp                not null,
    installment_number integer,
    amount             numeric(12, 2) default 0 not null,
    group_key          bigint default 0         not null,
    comment            varchar(255),

    foreign key (created_by_id) references users (id),
    foreign key (borrowing_id) references borrowings (id)
);

