import { Injectable } from '@angular/core';

interface NavConfigOptions {
  payeeId?: number;
  status?: string;
}
@Injectable()
export class LoanPayeesSideNavService {

  getNavList(currentRoute, options?: NavConfigOptions) {
    const idUrl = (options && options.payeeId) ? `${options.payeeId}/` : '';
    const navs = [
      {
        name: 'INFORMATION',
        url: `/${currentRoute}/${idUrl}info`,
        iconName: 'info'
      }
    ];

    if (options && options['status'] === 'DISBURSED' || options['status'] === 'REFUNDED') {
      navs.push({
        name: 'EVENTS',
        url: `/${currentRoute}/${idUrl}events`,
        iconName: 'note'
      })
    }
    return navs;
  }
}
