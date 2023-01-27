import { Injectable } from '@angular/core';

interface NavConfigOptions {
  bondId?: number;
  editMode?: boolean;
  createMode?: boolean;
  status?: string;
}

@Injectable()
export class BondSideNavService {

  getNavList(currentRoute, options?: NavConfigOptions) {
    const editUrlPart = (options && options.editMode) ? 'edit/' : '';
    const idUrlPart = (options && options.bondId) ? `${options.bondId}/` : '';

    const navs = [
      {
        name: 'INFORMATION',
        url: `/${currentRoute}/${
        ((idUrlPart && !options.createMode) ? idUrlPart : '')
        || (options.createMode ? 'create/' : '')}${editUrlPart}info`,
        iconName: 'info'
      },
      {
        name: 'SCHEDULE',
        url: `/${currentRoute}/${
        ((idUrlPart && !options.createMode) ? idUrlPart : '')
        || (options.createMode ? 'create/' : '')}${editUrlPart}schedule`,
        iconName: 'summarydetail'
      }
    ];

    if (options && options['status'] === 'SOLD' || options['status'] === 'CLOSED') {
      navs.push({
          name: 'EVENTS',
          url: `/${currentRoute}/${idUrlPart}events`,
          iconName: 'note'
        },
        {
          name: 'OPERATIONS',
          url: `/${currentRoute}/${idUrlPart}operations`,
          iconName: 'rating'
        })
    }

    return navs;
  }
}
