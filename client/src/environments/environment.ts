// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  API_ENDPOINT: `http://localhost:8080/api/`,
  DOMAIN: 'http://localhost:8080',
  DATE_FORMAT: 'yyyy-MM-dd',
  DATE_FORMAT_MOMENT: 'YYYY-MM-DD',
  DATE_TIME_FORMAT: 'MMM dd, yyyy HH:mm',
  DATE_TIME_FORMAT_PDF: 'MMM DD, YYYY HH:mm',
  TIME_FORMAT: 'THH:mm:ss',
  RESPONSE_DELAY: 300,

  STOMP_DEBUG: false,
  STOMP_HEARTBEAT_OUT: 1000,
  STOMP_HEARTBEAT_IN: 40000,

  NAVS: {
    MAIN_NAV: [
      {
        name: 'PROFILES',
        url: '/profiles',
        hasChildren: false
      },
      {
        name: 'ASSETS',
        url: null,
        hasChildren: true,
        children: [
          {
            name: 'LOAN_APPLICATIONS',
            url: '/loan-applications',
            hasChildren: false
          },
          {
            name: 'LOANS',
            url: '/loans',
            hasChildren: false
          }
        ]
      },
      {
        name: 'LIABILITIES',
        url: null,
        hasChildren: true,
        children: [
          {
            name: 'BORROWINGS',
            url: '/borrowings',
          },
          {
            name: 'SAVINGS',
            url: '/savings',
          },
          {
            name: 'TERM_DEPOSITS',
            url: '/term-deposits'
          },
          {
            name: 'BONDS',
            url: '/bonds'
          }
        ]
      },
      {
        name: 'TELLER_MANAGEMENT',
        url: '/till',
        hasChildren: false
      },
      {
        name: 'TRANSFERS',
        url: '/transfers',
        hasChildren: false
      },
      {
        name: 'ACCOUNTING',
        url: null,
        hasChildren: true,
        children: [
          {
            name: 'GENERAL_LEDGER',
            url: '/accounting/accounting-entries',
          },
          {
            name: 'CHART_OF_ACCOUNTS',
            url: '/accounting/chart-of-accounts',
          }
        ]
      },
      {
        name: 'MAKER_CHECKER',
        url: '/requests',
        hasChildren: false
      },
      {
        name: 'REPORTS',
        url: '/report-list',
        hasChildren: false
      }
    ]
  },

  FIELD_TYPES: [
    {
      key: 'TEXT',
      caption: 'Text'
    },
    {
      key: 'TEXT_AREA',
      caption: 'Textarea'
    },
    {
      key: 'LIST',
      caption: 'List'
    },
    {
      key: 'NUMERIC',
      caption: 'Number'
    },
    {
      key: 'DATE',
      caption: 'Date'
    },
    {
      key: 'LOOKUP',
      caption: 'Lookup'
    },
    {
      key: 'AGE',
      caption: 'Age'
    },
    {
      key: 'PATTERN',
      caption: 'Pattern'
    },
    {
      key: 'GRID',
      caption: 'Grid'
    }
  ],

  SUCCESS_TOAST_CONFIG: {
    preventDuplicates: true,
    timeOut: 10000,
    positionClass: 'toast-top-right',
    messageClass: 'slds-text-heading--small',
    closeButton: true
  },

  ERROR_TOAST_CONFIG: {
    preventDuplicates: true,
    timeOut: 100000,
    positionClass: 'toast-top-right',
    messageClass: 'slds-text-heading--small',
    closeButton: true
  },

  WARNING_TOAST_CONFIG: {
    preventDuplicates: true,
    timeOut: 10000,
    positionClass: 'toast-top-right',
    messageClass: 'slds-text-heading--small',
    closeButton: true
  },

  INFO_TOAST_CONFIG: {
    preventDuplicates: true,
    timeOut: 10000,
    positionClass: 'toast-top-right',
    messageClass: 'slds-text-heading--small',
    closeButton: true
  }
};
