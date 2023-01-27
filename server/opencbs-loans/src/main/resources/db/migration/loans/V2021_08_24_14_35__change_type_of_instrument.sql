update loan_application_custom_fields
set extra = '{"items":["Debt – Short term","Debt - Medium term","Debt - Long term","Mezzanine","Equity"]}'
where name = 'type_of_instrument';

update loan_application_custom_fields_values
set value = 'Debt – Short term'
where value = 'Debt – short term';

update loan_application_custom_fields_values
set value = trim(value)
where field_id
          = (select id from loan_application_custom_fields where name = 'type_of_instrument');

update loan_application_custom_fields_values
set value = null
where value = 'Debt - Credit Line';
