export class NavElements {

  public navConfig = [];

  public getNavConfig() {
    this.navConfig = [
      {
        link: `/configuration/system-setting/containers/regional-formats-date`,
        name: 'DATE_FORMAT',
        visible: true,
        icon: {collection: 'standard', name: 'event', className: 'event'}
      },
      {
        link: `/configuration/system-setting/containers/regional-formats-time`,
        name: 'TIME_FORMAT',
        visible: true,
        icon: {collection: 'custom', name: 'custom25', className: 'custom25'}
      },
      {
        link: `/configuration/system-setting/containers/regional-formats-number`,
        name: 'NUMBER_FORMAT',
        visible: true,
        icon: {collection: 'standard', name: 'topic2', className: 'topic2'}
      }
    ];

    return this.navConfig
  }
}
