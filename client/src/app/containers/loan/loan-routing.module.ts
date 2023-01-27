import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoansComponent } from './loan-list/loans.component';
import { LoanWrapComponent } from './loan-wrap/loan-wrap.component';
import { AuthGuard } from '../../core/guards';
import { LoanInfoComponent } from './loan-info/loan-info.component';
import { LoanScheduleComponent } from './loan-schedule/loan-schedule.component';
import { LoanEntryFeesComponent } from './loan-entry-fees/loan-entry-fees.component';
import { LoanPayeesComponent } from './loan-payees/loan-payees.component';
import { LoanAttachmentsComponent } from './loan-attachments/loan-attachments.component';
import {
  LoanGuarantorsComponent,
  LoanCreateGuarantorComponent,
  LoanEditGuarantorComponent,
  LoanGuarantorInfoComponent
} from './loan-guarantors';
import {
  LoanCollateralListComponent,
  LoanCollateralInfoComponent,
  LoanUpdateCollateralComponent,
  LoanCreateCollateralComponent
} from './loan-collaterals';
import { LoanEventsComponent } from './loan-events/loan-events.component';
import { LoanRepaymentComponent } from './loan-repayment/loan-repayment.component';
import { OnEditCanDeactivateGuard } from '../../core/guards';
import { LoanRescheduleComponent } from './loan-reschedule/loan-reschedule.component';
import { LoanPrintOutComponent } from './loan-print-out/loan-print-out/loan-print-out.component';
import { SpecialOperationsComponent } from './loan-special-operations/special-operations/special-operations.component';
import { OtherFeesComponent } from './loan-special-operations/other-fees/other-fees.component';
import { SpecialOperationsWrapComponent } from './loan-special-operations/special-operations-wrap.component';
import { LoanCustomFieldsComponent } from './loan-custom-fields/loan-custom-fileds-info/loan-custom-fields.component';
import { TopUpComponent } from './loan-special-operations/top-up/top-up.component';
import { RouteGuard } from '../../core/guards/route-guard.service';
import { LoanGroupRepaymentComponent } from './loan-group-repayment/loan-group-repayment.component';
import { LoanEventsMakerCheckerComponent } from './loan-events-maker-checker/loan-events-maker-checker.component';
import { LoanWrapMakerCheckerComponent } from './loan-wrap-maker-checker/loan-wrap-maker-checker.component';
import { LoanRepaymentMakerCheckerComponent } from './loan-repayment-maker-checker/loan-repayment-maker-checker.component';
import { LoanCommentsComponent } from './loan-comments/loan-comments.component';
import { ProvisioningComponent } from './loan-special-operations/provisioning/provisioning.component';
import { LoanCustomFieldsEditComponent } from './loan-custom-fields/loan-custom-fields-edit/loan-custom-fields-edit.component';
import { LoanDashboardComponent } from './loan-dashboard/loan-dashboard.component';
import { LoanPrintOutPreviewComponent } from './loan-print-out/loan-print-out-preview/loan-print-out-preview.component';

const routes: Routes = [
  {
    path: 'loans',
    component: LoansComponent,
    canActivate: [AuthGuard, RouteGuard],
    data: {groupName: 'LOANS'},
  },
  {
    path: 'loans-maker-checker/:id',
    component: LoanWrapMakerCheckerComponent,
    canActivate: [AuthGuard, RouteGuard],
    data: {groupName: 'MAKER_CHECKER'},
    children: [
      {
        path: '',
        redirectTo: 'maker-checker',
        pathMatch: 'full'
      },
      {
        path: 'maker-checker-rollback',
        component: LoanEventsMakerCheckerComponent,
      },
      {
        path: 'maker-checker-repayment',
        component: LoanRepaymentMakerCheckerComponent,
      }
    ]
  },
  {
    path: 'loans/:id/:loanType',
    component: LoanWrapComponent,
    canActivate: [AuthGuard, RouteGuard],
    data: {groupName: 'LOANS'},
    children: [
      {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full'
      },
      {
        path: 'loan-dashboard',
        component: LoanDashboardComponent,
      },
      {
        path: 'info',
        component: LoanInfoComponent,
      },
      {
        path: 'schedule',
        children: [
          {
            path: '',
            component: LoanScheduleComponent
          },
          {
            path: 'reschedule',
            component: LoanRescheduleComponent,
            canDeactivate: [OnEditCanDeactivateGuard],
            canActivate: [RouteGuard],
            data: {roles: ['LOAN_RESCHEDULE']}
          }
        ]
      },
      {
        path: 'entry-fees-list',
        component: LoanEntryFeesComponent
      },
      {
        path: 'payees',
        component: LoanPayeesComponent,
      },
      {
        path: 'attachments',
        component: LoanAttachmentsComponent,
      },
      {
        path: 'custom-fields',
        component: LoanCustomFieldsComponent,
      },
      {
        path: 'custom-fields/edit',
        component: LoanCustomFieldsEditComponent,
        canDeactivate: [OnEditCanDeactivateGuard]
      },
      {
        path: 'guarantors',
        component: LoanGuarantorsComponent
      },
      {
        path: 'guarantors/new',
        component: LoanCreateGuarantorComponent
      },
      {
        path: 'guarantors/:id/edit',
        component: LoanEditGuarantorComponent,
        canDeactivate: [OnEditCanDeactivateGuard]
      },
      {
        path: 'guarantors/:id',
        component: LoanGuarantorInfoComponent
      },
      {
        path: 'collateral/new',
        component: LoanCreateCollateralComponent
      },
      {
        path: 'collateral',
        component: LoanCollateralListComponent
      },
      {
        path: 'collateral/:id',
        component: LoanCollateralInfoComponent
      },
      {
        path: 'collateral/:id/edit',
        canDeactivate: [OnEditCanDeactivateGuard],
        component: LoanUpdateCollateralComponent
      },
      {
        path: 'print-out',
        component: LoanPrintOutComponent
      },
      {
        path: 'print-out-preview',
        component: LoanPrintOutPreviewComponent
      },
      {
        path: 'events',
        component: LoanEventsComponent,
      },
      {
        path: 'comments',
        component: LoanCommentsComponent
      },
      {
        path: 'operations',
        component: SpecialOperationsWrapComponent,
        children: [
          {
            path: '',
            component: SpecialOperationsComponent
          },
          {
            path: 'other-fees',
            component: OtherFeesComponent
          },
          {
            path: 'top-up',
            component: TopUpComponent
          },
          {
            path: 'provisioning',
            component: ProvisioningComponent
          }
        ]
      }
    ]
  },
  {
    path: 'loans/:id/:loanType',
    component: LoanWrapComponent,
    canActivate: [AuthGuard, RouteGuard],
    data: {groupName: 'MAKER_CHECKER'},
    children: [
      {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full'
      },
      {
        path: 'schedule',
        children: [
          {
            path: 'repayment',
            component: LoanRepaymentComponent,
            canDeactivate: [OnEditCanDeactivateGuard],
            canActivate: [RouteGuard],
            data: {roles: ['MAKER_FOR_LOAN_REPAYMENT']}
          },
          {
            path: 'group-repayment',
            component: LoanGroupRepaymentComponent,
            canDeactivate: [OnEditCanDeactivateGuard],
            canActivate: [RouteGuard],
            data: {roles: ['MAKER_FOR_LOAN_REPAYMENT']}
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanRoutingModule {
}
