import { Injectable } from '@angular/core';

interface NavConfigOptions {
  tillId?: number;
  editMode?: boolean;
  createMode?: boolean;
}

@Injectable()
export class TellerSideNavService {

  getNavList(currentRoute, options?: NavConfigOptions) {
    const idUrlPart = (options && options.tillId) ? `${options.tillId}/` : '';

    const navs = [
      {
        name: 'INFORMATION',
        url: `/${currentRoute}/${idUrlPart}list`,
        iconName: 'info'
      },
      {
        name: 'OPERATIONS',
        url: `/${currentRoute}/${idUrlPart}operations`,
        iconName: 'rating'
      }
    ];
    return navs;
  }
}
