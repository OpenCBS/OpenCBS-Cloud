-- noinspection SqlNoDataSourceInspectionForFile

alter table loans add disbursement_date date;

update
  loans l
set
  disbursement_date = la.disbursement_date
from
  loan_applications la
where
  la.id = l.loan_application_id;

alter table loans alter column disbursement_date set not null;
