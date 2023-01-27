update permissions
set
  name = 'LOAN_APPLICATIONS'
where name = 'LOAN_APPLICATION';

update permissions
set
  module_type = 'CONFIGURATIONS'
where module_type = 'CONFIGURATION';

update permissions
set
  module_type = 'LOANS'
where module_type = 'LOAN';

update permissions
set
  module_type = 'LOAN_APPLICATIONS'
where module_type = 'LOAN_APPLICATION';

update permissions
set
  module_type = 'TASKS_MANAGEMENT'
where module_type = 'TASK_MANAGEMENT';

update permissions
set
  module_type = 'TILLS'
where module_type = 'TILL';

delete from roles_permissions where permission_id in (select id from permissions where name in (
  'LOAN_APPLICATIONS',
  'LOANS',
  'PROFILES',
  'MODULE'
));

delete from permissions where name in (
  'LOAN_APPLICATIONS',
  'LOANS',
  'PROFILES',
  'MODULE'
);
