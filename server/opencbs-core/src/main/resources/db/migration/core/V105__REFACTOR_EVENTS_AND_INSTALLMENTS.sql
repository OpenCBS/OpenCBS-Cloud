-- noinspection SqlNoDataSourceInspectionForFile

alter table events
add column installment_number integer null,
add column amount decimal(12, 2) not null default 0,
add column group_key bigint not null default 0;

create sequence events_group_key_seq;

alter table loan_installment_logs drop constraint loans_installments_history_event_id_fkey;

alter table loan_installment_logs rename column event_id to event_group_key;

alter table loan_installment_logs add column effective_at timestamp without time zone not null;

alter table loan_installment_logs drop constraint loans_installments_history_loan_id_fkey;
alter table loan_installment_logs add constraint loan_installments_loan_id_fkey foreign key (loan_id) references loans(id);

alter index loans_installments_history_pkey rename to loan_installments_pkey;

drop view loan_installments;
alter table loan_installment_logs rename to loan_installments;

alter table loan_installments
alter column paid_principal set default 0, alter column paid_principal set not null;

alter table loan_installments
alter column paid_interest set default 0, alter column paid_interest set not null;

alter table loan_installments
alter column loan_id type bigint;

alter table loan_installments rename to loans_installments;
create index on loans_installments (loan_id);

alter table events rename to loans_events;
drop table transactions;
