create table companies_attachments (
  id bigserial primary key,
  company_id bigint not null,
  filename varchar (255) not null,
  content_type varchar(255) not null,
  pinned boolean not null default false,
  created_at timestamp without time zone not null,
  created_by_id bigint not null
);

alter table companies_attachments
add constraint companies_attachments_company_id_fkey
foreign key (company_id) references profiles(id);

alter table companies_attachments
add constraint companies_attachments_created_by_id_fkey
foreign key (created_by_id) references users(id);

insert into companies_attachments (id, company_id, filename, content_type, pinned, created_at, created_by_id)
select id, profile_id, name, content_type, pinned, created_at, created_by_id
from profile_attachments
where "type" = 'COMPANY';

select setval('companies_attachments_id_seq', (select max(id) from profile_attachments where "type" = 'COMPANY'));