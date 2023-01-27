import { Injectable } from '@angular/core';
import { LoanAppStatus } from '../../../../core/loan-application-status.enum';

interface NavConfigOptions {
  loanAppId?: number;
  editMode?: boolean;
  createMode?: boolean;
  hasPayee?: any[];
  status?: string;
  profileType?: string
  loanType?: string
}

const GROUP_TYPE_LOAN_NAVS = ['INFORMATION', 'PRINT_OUT', 'OPERATIONS'];

@Injectable()
export class LoanAppSideNavService {

  getNavList(currentRoute, options?: NavConfigOptions) {
    const editUrlPart = (options && options.editMode) ? 'edit/' : '';
    const idUrlPart = (options && options.loanAppId) ? `${options.loanAppId}/` : '';
    let navs = [
      {
        name: 'LOAN_DASHBOARD',
        url: `/${currentRoute}/${
          ((idUrlPart && !options.createMode) ? idUrlPart : '')
          || (options.createMode ? 'create/' : '')}${options.loanType ? `${options.loanType.toLowerCase()}/` : ''}${editUrlPart}loan-dashboard`,
        iconName: 'metrics'
      },
      {
        name: 'INFORMATION',
        url: `/${currentRoute}/${
          ((idUrlPart && !options.createMode) ? idUrlPart : '')
          || (options.createMode ? 'create/' : '')}${options.loanType ? `${options.loanType.toLowerCase()}/` : ''}${editUrlPart}info`,
        iconName: 'info'
      },
      {
        name: 'SCHEDULE',
        url: `/${currentRoute}/${
          ((idUrlPart && !options.createMode) ? idUrlPart : '')
          || (options.createMode ? 'create/' : '')}${options.loanType ? `${options.loanType.toLowerCase()}/` : ''}${editUrlPart}schedule`,
        iconName: 'summarydetail'
      },
      {
        name: 'ADDITIONAL_INFORMATION',
        url: `/${currentRoute}/${idUrlPart}/${options.loanType ? options.loanType.toLowerCase() + '/' : ''}custom-fields`,
        iconName: 'list'
      },
      {
        name: 'ATTACHMENTS',
        url: `/${currentRoute}/${idUrlPart}/${options.loanType ? options.loanType.toLowerCase() + '/' : ''}attachments`,
        iconName: 'page'
      },
      {
        name: 'GUARANTORS',
        url: `/${currentRoute}/${idUrlPart}/${options.loanType ? options.loanType.toLowerCase() + '/' : ''}guarantors`,
        iconName: 'people'
      },
      {
        name: 'COLLATERALS',
        url: `/${currentRoute}/${idUrlPart}/${options.loanType ? options.loanType.toLowerCase() + '/' : ''}collateral`,
        iconName: 'standard_objects'
      },
      {
        name: 'PRINT_OUT',
        url: `/${currentRoute}/${idUrlPart}/${options.loanType ? options.loanType.toLowerCase() + '/' : ''}print-out`,
        iconName: 'upload'
      },
      {
        name: 'EPITOME',
        url: `/${currentRoute}/${idUrlPart}/${options.loanType ? options.loanType.toLowerCase() + '/' : ''}comments`,
        iconName: 'comments'
      },
      {
        name: 'CREDIT_COMMITTEE',
        url: `/${currentRoute}/${idUrlPart}credit-committee`,
        iconName: 'approval',
        need_approve: (options && options['status'] === LoanAppStatus[LoanAppStatus.PENDING])
      }
    ];

    if ( options && options.createMode ) {
      if ( options.profileType === 'GROUP' ) {
        navs.splice(-8);
      } else {
        navs.splice(-7);
      }
    }

    if ( options && options['status'] === LoanAppStatus[LoanAppStatus.IN_PROGRESS] ) {
      if ( options.profileType === 'GROUP' ) {
        navs.splice(1, 1);
        navs.splice(4, 3);
      }
      navs.splice(-1);
    }

    if ( options && (options['status'] === LoanAppStatus[LoanAppStatus.PENDING]
      || options['status'] === LoanAppStatus[LoanAppStatus.APPROVED]
      || options['status'] === LoanAppStatus[LoanAppStatus.DISBURSED]) ) {
      if ( options.profileType === 'GROUP' ) {
        navs.splice(1, 1);
        navs.splice(4, 3);
      }
    }

    if ( currentRoute === 'loans' ) {
      navs.splice(-1);
      if ( options.hasPayee.length ) {
        navs.push({
          name: 'PAYEES',
          url: `/${currentRoute}/${idUrlPart}/${options.loanType ? options.loanType.toLowerCase() + '/' : ''}payees`,
          iconName: 'resource_territory'
        })
      }
      navs.push(
        {
          name: 'EVENTS',
          url: `/${currentRoute}/${idUrlPart}/${options.loanType ? options.loanType.toLowerCase() + '/' : ''}events`,
          iconName: 'note'
        },
        {
          name: 'OPERATIONS',
          url: `/${currentRoute}/${idUrlPart}/${options.loanType ? options.loanType.toLowerCase() + '/' : ''}operations`,
          iconName: 'rating'
        }
      );
    }

    if ( options.loanType === 'GROUP' ) {
      navs = navs.filter(navItem => GROUP_TYPE_LOAN_NAVS.indexOf(navItem.name) >= 0);
    }

    if (currentRoute === 'loan-applications') {
      navs.splice(0, 1);
    }

    return navs;
  }
}
