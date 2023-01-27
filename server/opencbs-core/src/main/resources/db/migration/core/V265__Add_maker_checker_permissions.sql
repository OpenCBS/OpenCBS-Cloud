insert into permissions (name, description, module_type, permanent)
values ('CHECKER_FOR_ROLE', '', 'MAKER_CHECKER', true),
       ('MAKER_FOR_ROLE', '', 'MAKER_CHECKER', true);

insert into roles_permissions (role_id, permission_id)
values  (1, (select id from permissions where name = 'CHECKER_FOR_ROLE')),
        (1, (select id from permissions where name = 'MAKER_FOR_ROLE'));

create table request (
 id             bigserial    primary key,
 type           varchar(255) not null,
 created_by_id  bigint       not null references users (id),
 created_at     timestamp    not null default now(),
 approved_by_id bigint       references users (id),
 deleted_by_id  bigint       references users (id),
 deleted_at     timestamp,
 deleted        boolean      not null default false,
 expire_date    date         not null default (now() + interval '1 week'),
 content        jsonb        not null,
 branch_id      bigint       not null default 1 references branches (id)
);

create table checker_request (
 id             bigserial     primary key,
 permission_id  bigint        not null references permissions(id),
 request_type   varchar(255)  not null
);

insert into checker_request (permission_id, request_type)
values ((select id from permissions where name = 'CHECKER_FOR_ROLE'), 'ROLE_CREATE'),
       ((select id from permissions where name = 'CHECKER_FOR_ROLE'), 'ROLE_EDIT');