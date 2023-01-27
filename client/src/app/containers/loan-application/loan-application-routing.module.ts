import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoanApplicationListComponent } from './loan-application-list/loan-application-list.component';
import { LoanAppWrapCreateComponent } from './loan-application-wrap-create/loan-application-wrap-create.component';
import { AuthGuard } from '../../core/guards/auth-guard.service';
import { LoanAppScheduleComponent } from './loan-application-schedule/loan-application-schedule.component';
import { LoanAppWrapComponent } from './loan-application-wrap/loan-application-wrap.component';
import { LoanApplicationInfoComponent } from './loan-application-info/loan-application-info.component';
import { LoanApplicationAttachmentsComponent } from './loan-application-attachments/loan-application-attachments.component';
import {
  LoanAppGuarantorsComponent
} from './loan-application-guarantors/loan-application-guarantor-list/loan-application-guarantors.component';
import {
  LoanAppCreateGuarantorComponent
} from './loan-application-guarantors/loan-application-guarantor-create/loan-application-guarantor-create.component';
import {
  LoanAppEditGuarantorComponent
} from './loan-application-guarantors/loan-application-guarantor-edit/loan-application-guarantor-edit.component';
import {
  LoanAppGuarantorInfoComponent
} from './loan-application-guarantors/loan-application-guarantors-info/loan-application-guarantors-info.component';
import {
  LoanAppCollateralListComponent
} from './loan-application-collaterals/loan-application-collateral-list/loan-application-collateral-list.component';
import {
  LoanAppCreateCollateralComponent
} from './loan-application-collaterals/loan-application-collateral-create/loan-application-collateral-create.component';
import {
  LoanAppCollateralInfoComponent
} from './loan-application-collaterals/loan-application-collateral-info/loan-application-collateral-info.component';
import {
  LoanAppUpdateCollateralComponent
} from './loan-application-collaterals/loan-application-collateral-edit/loan-application-collateral-edit.component';
import { CreditCommitteeComponent } from './loan-application-credit-committee/loan-application-credit-committee.component';
import { OnEditCanDeactivateGuard } from '../../core/guards/on-edit-deactivate-guard.service';
import { LoanAppNewComponent } from './loan-app-new/loan-app-new.component';
import { LoanAppWrapEditComponent } from './loan-application-wrap-edit/loan-application-wrap-edit.component';
import { LoanAppPrintOutComponent } from './loan-app-print-out/loan-app-print-out/loan-app-print-out.component';
import {
  LoanApplicationCustomFieldInfoComponent
} from './loan-application-custom-fields/loan-application-custom-field-info/loan-application-custom-field-info.component';
import {
  LoanApplicationCustomFieldEditComponent
} from './loan-application-custom-fields/loan-application-custom-field-edit/loan-application-custom-field-edit.component';
import { RouteGuard } from '../../core/guards/route-guard.service';
import { LoanAppMakerCheckerWrapComponent } from './loan-app-maker-checker-wrap/loan-app-maker-checker-wrap.component';
import { LoanAppMakerCheckerDisburseComponent } from './loan-app-maker-checker-disburse/loan-app-maker-checker-disburse.component';
import { LoanApplicationCommentsComponent } from './loan-application-comments/loan-application-comments.component';
import { LoanAppPrintOutPreviewComponent } from './loan-app-print-out/loan-app-print-out-preview/loan-app-print-out-preview.component';

const routes: Routes = [
  {
    path: 'loan-applications',
    component: LoanApplicationListComponent,
    canActivate: [AuthGuard, RouteGuard],
    data: {groupName: 'LOAN_APPLICATIONS'}
  },
  {
    path: 'loan-applications/create',
    component: LoanAppWrapCreateComponent,
    canActivate: [AuthGuard, RouteGuard],
    data: {groupName: 'LOAN_APPLICATIONS'},
    children: [
      {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full'
      },
      {
        path: 'info',
        component: LoanAppNewComponent
      },
      {
        path: 'schedule',
        component: LoanAppScheduleComponent,
        canDeactivate: [OnEditCanDeactivateGuard]
      }
    ]
  },
  {
    path: 'loan-app-maker-checker/:id',
    component: LoanAppMakerCheckerWrapComponent,
    canActivate: [RouteGuard],
    data: {groupName: 'LOAN_APPLICATIONS'},
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'maker-checker',
        pathMatch: 'full'
      },
      {
        path: 'maker-checker',
        component: LoanAppMakerCheckerDisburseComponent
      }
    ]
  },
  {
    path: 'loan-applications/:id',
    component: LoanAppWrapComponent,
    canActivate: [RouteGuard],
    data: {groupName: 'LOAN_APPLICATIONS'},
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full'
      },
      {
        path: 'info',
        component: LoanApplicationInfoComponent,
      },
      {
        path: 'schedule',
        component: LoanAppScheduleComponent,
        canDeactivate: [OnEditCanDeactivateGuard]
      },
      {
        path: 'custom-fields',
        component: LoanApplicationCustomFieldInfoComponent
      },
      {
        path: 'custom-fields/edit',
        component: LoanApplicationCustomFieldEditComponent
      },
      {
        path: 'attachments',
        component: LoanApplicationAttachmentsComponent,
      },
      {
        path: 'guarantors',
        component: LoanAppGuarantorsComponent
      },
      {
        path: 'guarantors/new',
        component: LoanAppCreateGuarantorComponent
      },
      {
        path: 'guarantors/:id/edit',
        canDeactivate: [OnEditCanDeactivateGuard],
        component: LoanAppEditGuarantorComponent
      },
      {
        path: 'guarantors/:id',
        component: LoanAppGuarantorInfoComponent
      },
      {
        path: 'collateral',
        component: LoanAppCollateralListComponent
      },
      {
        path: 'collateral/new',
        component: LoanAppCreateCollateralComponent
      },
      {
        path: 'collateral/:id',
        component: LoanAppCollateralInfoComponent
      },
      {
        path: 'collateral/:id/edit',
        canDeactivate: [OnEditCanDeactivateGuard],
        component: LoanAppUpdateCollateralComponent
      },
      {
        path: 'print-out',
        component: LoanAppPrintOutComponent
      },
      {
        path: 'print-out-preview',
        component: LoanAppPrintOutPreviewComponent
      },
      {
        path: 'credit-committee',
        component: CreditCommitteeComponent
      },
      {
        path: 'comments',
        component: LoanApplicationCommentsComponent
      }
    ]
  },
  {
    path: 'loan-applications/:id/edit',
    component: LoanAppWrapEditComponent,
    canActivate: [RouteGuard],
    canActivateChild: [AuthGuard],
    data: {roles: ['UPDATE_LOANS_APPLICATIONS']},
    children: [
      {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full'
      },
      {
        path: 'info',
        component: LoanAppNewComponent,
      },
      {
        path: 'schedule',
        component: LoanAppScheduleComponent,
        canDeactivate: [OnEditCanDeactivateGuard]
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanApplicationRoutingModule {
}
