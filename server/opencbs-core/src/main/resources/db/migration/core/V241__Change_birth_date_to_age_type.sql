update
  custom_fields
set
  field_type = 'AGE'
where
  name = 'birth_date';

update
  people_custom_fields
set
  field_type = 'AGE'
where
  name = 'birth_date';