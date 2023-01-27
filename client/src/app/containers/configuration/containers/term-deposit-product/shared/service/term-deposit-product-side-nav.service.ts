import { Injectable } from '@angular/core';

interface NavConfigOptions {
  termDepositProductId?: number;
  editMode?: boolean;
  createMode?: boolean;
  status?: string;
}

@Injectable()
export class TermDepositProductSideNavService {

  getNavList(currentRoute, options?: NavConfigOptions) {
    const editUrlPart = (options && options.editMode) ? 'edit/' : '';
    const idUrlPart = (options && options.termDepositProductId) ? `${options.termDepositProductId}/` : '';
    const navs = [];

    if ( options && options['createMode'] === false && options['createMode'] === false ) {
      navs.push({
        name: 'INFORMATION',
        url: `/${currentRoute}/${
          ((idUrlPart && !options.createMode) ? idUrlPart : '')
          || (options.createMode ? 'create/' : '')}${editUrlPart}info`,
        iconName: 'info'
      })
    }

    if ( options && options['createMode'] === true && options['createMode'] === true ) {
      navs.push({
        name: 'MAKER/CHECKER',
        url: `/${currentRoute}/${idUrlPart}maker-checker`,
        iconName: 'info'
      })
    }

    return navs;
  }
}
