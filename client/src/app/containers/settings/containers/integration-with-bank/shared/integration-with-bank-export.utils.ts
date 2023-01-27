export const setNavElements = () => {
  return [
    {
      link: `/integration-with-bank/integration-with-bank-export-file-list`,
      name: 'EXPORTED_FILE_LIST',
      visible: true,
      icon: {collection: 'standard', name: 'timesheet', className: 'timesheet'}
    },
    {
      link: `/integration-with-bank/integration-with-bank-export-file`,
      name: 'Export',
      visible: true,
      icon: {collection: 'standard', name: 'sales_path', className: 'sales-path'}
    }
  ];
};
