update permissions
set
  name = 'TELLER_MANAGEMENT'
where name = 'TILLS';

update permissions
set
  module_type = 'TELLER_MANAGEMENT'
where module_type = 'TILLS';
