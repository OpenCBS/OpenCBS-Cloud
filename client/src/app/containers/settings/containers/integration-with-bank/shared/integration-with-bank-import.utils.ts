export const setNavElements = () => {
  return [
    {
      link: `/integration-with-bank/integration-with-bank-import-file-list`,
      name: 'IMPORTED_FILE_LIST',
      visible: true,
      icon: {collection: 'standard', name: 'timesheet', className: 'timesheet'}
    },
    {
      link: `/integration-with-bank/integration-with-bank-import-file`,
      name: 'IMPORT',
      visible: true,
      icon: {collection: 'standard', name: 'product_consumed', className: 'product-consumed'}
    }
  ];
};
