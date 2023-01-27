import { Injectable } from '@angular/core';

interface NavConfigOptions {
  roleId?: number;
  editMode?: boolean;
  createMode?: boolean;
  status?: string;
}

@Injectable()
export class RoleSideNavService {

  getNavList(currentRoute, options?: NavConfigOptions) {
    const editUrlPart = (options && options.editMode) ? 'edit/' : '';
    const idUrlPart = (options && options.roleId) ? `${options.roleId}/` : '';

    const navs = [

    ];

    if (options && options['createMode'] === false && options['createMode'] === false) {
      navs.push({
        name: 'INFORMATION',
        url: `/${currentRoute}/${
        ((idUrlPart && !options.createMode) ? idUrlPart : '')
        || (options.createMode ? 'create/' : '')}${editUrlPart}info`,
        iconName: 'info'
      })
    }

    if (options && options['createMode'] === true && options['createMode'] === true) {
      navs.push({
        name: 'MAKER/CHECKER',
        url: `/${currentRoute}/${idUrlPart}maker-checker`,
        iconName: 'info'
      })
    }

    // if (options && options['createMode'] === false && options['createMode'] === false) {
    //   navs.push({
    //     name: 'HISTORY',
    //     url: `/${currentRoute}/${idUrlPart}history`,
    //     iconName: 'list'
    //   })
    // }

    return navs;
  }
}
