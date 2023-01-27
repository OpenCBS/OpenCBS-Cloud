import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TillListComponent } from './till-list/till-list.component';
import { TillOperationListComponent } from './till-operation-list/till-operation-list.component';
import { TillOperationInfoComponent } from './till-operation-info/till-operation-info.component';
import { TillOperationEditComponent } from './till-operation-edit/till-operation-edit.component';
import { OperationsNewComponent, } from './till-operation-new/till-operation-new.component';
import { TransferComponent } from './transfer/transfer.component';
import { AuthGuard } from '../../core/guards/auth-guard.service';
import { TillOperationLoansComponent } from './till-operation-loans/till-operation-loans.component';
import { TillOperationLoansRepayComponent } from './till-operation-loans-repay/till-operation-loans-repay.component';
import { TillOperationWrapListComponent } from './till-operation-wrap-list/till-operation-wrap-list.component';
import { RouteGuard } from '../../core/guards/route-guard.service';
import { TellerSpecialOperationComponent } from './till-special-operations/special-operations/special-operations.component';
import { TillOperationListDetailsComponent } from './till-operation-list-details/till-operation-list-details.component';
import {
  TillOperationLoansRepayForKazmicroComponent
} from './till-operation-loans-repay-for-kazmicro/till-operation-loans-repay-for-kazmicro.component';

const routes: Routes = [
  {
    path: 'till',
    component: TillListComponent,
    canActivate: [AuthGuard, RouteGuard],
    data: {groupName: 'TELLER_MANAGEMENT'}
  },
  {
    path: 'till/:id/transfer/:type',
    component: TransferComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'till/:id',
    component: TillOperationWrapListComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: TillOperationListComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: 'list',
            component: TillOperationListDetailsComponent,
            pathMatch: 'full',
          },
          {
            path: 'operations',
            component: TillOperationWrapListComponent,
            canActivateChild: [AuthGuard],
            children: [
              {
                path: '',
                component: TellerSpecialOperationComponent,
                pathMatch: 'full',
              },
              {
                path: ':type',
                component: OperationsNewComponent,
                canActivate: [AuthGuard]
              },
            ]
          },
        ]
      },
      {
        path: 'loans',
        component: TillOperationLoansComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'loans/:id/repay',
        component: TillOperationLoansRepayComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'loans/:id/repay-for-kazmicro',
        component: TillOperationLoansRepayForKazmicroComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: 'till/:tillId/operations/info/:id',
    component: TillOperationInfoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'till/:tillId/operations/info/:id/edit',
    component: TillOperationEditComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TellerManagementRoutingModule {
}
