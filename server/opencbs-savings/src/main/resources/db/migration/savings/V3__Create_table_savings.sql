create table savings (
    id                         bigserial primary key,
    code                       varchar(32)    not null,
    profile_id                 int            not null references profiles (id),
    saving_product_id          int            not null references saving_products (id),
    interest_rate              decimal(8, 4)  not null,
    interest_accrual_frequency varchar(32)    not null,
    interest_posting_frequency varchar(32)    not null,
    capitalized                boolean        not null default false,
    deposit_amount_min         decimal(14, 2) not null,
    deposit_amount_max         decimal(14, 2) not null,
    deposit_fee_rate           decimal(14, 2),
    deposit_fee_flat           decimal(14, 2),
    withdrawal_amount_min      decimal(14, 2) not null,
    withdrawal_amount_max      decimal(14, 2) not null,
    withdrawal_fee_rate        decimal(14, 2),
    withdrawal_fee_flat        decimal(14, 2),
    transfer_amount_min        decimal(14, 2) not null,
    transfer_amount_max        decimal(14, 2) not null,
    transfer_fee_rate          decimal(14, 2),
    transfer_fee_flat          decimal(14, 2),
    management_fee_rate        decimal(14, 2),
    management_fee_flat        decimal(14, 2),
    management_fee_frequency   varchar(32)    not null,
    entry_fee_rate             decimal(14, 2),
    entry_fee_flat             decimal(14, 2),
    close_fee_rate             decimal(14, 2),
    close_fee_flat             decimal(14, 2),
    status                     varchar(32)    not null,
    created_at                 timestamp      not null,
    open_date                  timestamp,
    close_date                 timestamp,
    reopen_date                timestamp,
    deposit_date               timestamp,
    withdraw_date              timestamp,
    created_by_id              int            not null references users (id),
    opened_by_id               int            references users (id),
    closed_by_id               int            references users (id),
    reopened_by_id             int            references users (id),
    deposited_by_id            int            references users (id),
    withdrawed_by_id           int            references users (id),
    locked                     boolean        not null default false,
    saving_officer_id          int            not null
);

create table savings_accounts (
    id         bigserial primary key,
    type       varchar(50) not null,
    saving_id  int         not null  references savings (id),
    account_id int         not null  references accounts (id)
);

create table savings_accounting_entries (
    saving_id           int not null references savings (id),
    accounting_entry_id int not null references accounting_entries (id)
);

insert into global_settings
(name, type, value)
values ('SAVING_CODE_PATTERN', 'TEXT', '"SAVING" + saving_id')