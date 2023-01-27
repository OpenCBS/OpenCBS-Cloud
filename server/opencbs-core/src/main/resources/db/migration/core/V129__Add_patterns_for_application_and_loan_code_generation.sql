insert into global_settings (name, type, "value")
values ('LOAN_APPLICATION_CODE_PATTERN', 'TEXT',
        'application.getCreatedBy().getBranch().getCode() + "/" + new Date().getFullYear().toString().substr(-2)'
        || '+ "/" + application.getLoanProduct().getCode()+ "/" + profile_id + "/" + application_id');
insert into global_settings (name, type, "value")
values ('LOAN_CODE_PATTERN', 'TEXT', '"BL" + loan_id');

alter table loan_products
  add column code varchar(32) unique;
update loan_products
set "code" = '00' || id;

alter table loan_products
  alter column code set not null;

alter table loans
  add column code varchar(100);

update loans
set code = 'loan-' || id;

alter table loans
  alter column code set not null;

alter table loan_applications
  add column code varchar(100);

update loan_applications
set code = 'application-' || id;

alter table loan_applications
  alter column code set not null;

update users
set branch_id = 1
