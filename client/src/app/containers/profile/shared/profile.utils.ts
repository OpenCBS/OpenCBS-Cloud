export const setNavElements = (profileType: string, profileId: number, permissions) => {
  let navConfig = [
    {
      link: `/profiles/${profileType}/${profileId}/info`,
      name: 'INFORMATION',
      visible: false,
      permission: 'PROFILES',
      icon: {collection: 'standard', name: 'calibration', className: 'calibration'},
      availability: ['people', 'companies', 'groups']
    },
    {
      link: `/profiles/${profileType}/${profileId}/attachments`,
      name: 'ATTACHMENTS',
      visible: false,
      permission: 'PROFILES',
      icon: {collection: 'standard', name: 'timesheet', className: 'timesheet'},
      availability: ['people', 'companies', 'groups']
    },
    {
      link: `/profiles/${profileType}/${profileId}/members`,
      name: 'Members',
      visible: false,
      permission: 'PROFILES',
      icon: {collection: 'standard', name: 'groups', className: 'groups'},
      availability: ['companies', 'groups']
    },
    {
      link: `/profiles/${profileType}/${profileId}/current-accounts`,
      name: 'CURRENT_ACCOUNTS',
      visible: false,
      permission: 'PROFILES',
      icon: {collection: 'custom', name: 'custom62', className: 'custom62'},
      availability: ['people', 'companies']
    },
    {
      link: `/profiles/${profileType}/${profileId}/credit-line-list`,
      name: 'CREDIT_LINES',
      visible: false,
      permission: 'LOAN_APPLICATIONS',
      icon: {collection: 'custom', name: 'custom102', className: 'custom102'},
      availability: ['people', 'companies', 'groups']
    },
    {
      link: `/profiles/${profileType}/${profileId}/loan-applications`,
      name: 'LOAN_APPLICATIONS',
      visible: false,
      permission: 'LOAN_APPLICATIONS',
      icon: {collection: 'custom', name: 'custom41', className: 'custom41'},
      availability: ['people', 'companies', 'groups']
    },
    {
      link: `/profiles/${profileType}/${profileId}/loans`,
      name: 'LOANS',
      visible: false,
      permission: 'LOANS',
      icon: {collection: 'standard', name: 'task', className: 'task'},
      availability: ['people', 'companies', 'groups']
    },
    {
      link: `/profiles/${profileType}/${profileId}/borrowings`,
      name: 'BORROWINGS',
      visible: false,
      permission: 'PROFILES',
      icon: {collection: 'custom', name: 'custom42', className: 'custom42'},
      availability: ['people', 'companies']
    },
    {
      link: `/profiles/${profileType}/${profileId}/savings`,
      name: 'SAVINGS',
      visible: false,
      permission: 'SAVINGS',
      icon: {collection: 'standard', name: 'case', className: 'case'},
      availability: ['people', 'companies']
    },
    {
      link: `/profiles/${profileType}/${profileId}/term-deposits`,
      name: 'TERM_DEPOSITS',
      visible: false,
      permission: 'TERM_DEPOSITS',
      icon: {collection: 'custom', name: 'custom17', className: 'custom17'},
      availability: ['people', 'companies']
    },
    {
      link: `/profiles/${profileType}/${profileId}/bonds`,
      name: 'BONDS',
      visible: false,
      permission: 'TERM_DEPOSITS',
      icon: {collection: 'custom', name: 'custom40', className: 'custom40'},
      availability: ['people', 'companies']
    },
    {
      link: `/profiles/${profileType}/${profileId}/print-out`,
      name: 'PRINT_OUT',
      visible: false,
      permission: 'PROFILES',
      icon: {collection: 'standard', name: 'record', className: 'record'},
      availability: ['people', 'companies', 'groups']
    },
    {
      link: `/profiles/${profileType}/${profileId}/events`,
      name: 'EVENTS',
      visible: false,
      permission: 'PROFILES',
      icon: {collection: 'custom', name: 'custom53', className: 'custom53'},
      availability: ['people', 'companies', 'groups']
    }
  ];

  navConfig.filter(config => {
    config['visible'] = permissions.some(o => o.group === config['permission']);
  });

  navConfig = navConfig.filter(config => config['availability'].some(o => o === profileType));
  return navConfig;
};

