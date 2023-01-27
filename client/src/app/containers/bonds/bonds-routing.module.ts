import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BondListComponent } from './bond-list/bond-list.component';
import { AuthGuard } from '../../core/guards/auth-guard.service';
import { BondWrapCreateComponent } from './bond-wrap-create/bond-wrap-create.component';
import { BondWrapEditComponent } from './bond-wrap-edit/bond-wrap-edit.component';
import { BondNewComponent } from './bond-new/bond-new.component';
import { BondWrapComponent } from './bond-wrap/bond-wrap.component';
import { BondInfoComponent } from './bond-info/bond-info.component';
import { BondScheduleComponent } from './bond-schedule/bond-schedule.component';
import { BondEventsComponent } from './bond-events/bond-events.component';
import { BondOperationsWrapComponent } from './bond-operations/bond-operations-wrap.component';
import { BondOperationsComponent } from './bond-operations/operations/operations.component';
import { BondRepaymentComponent } from './bond-repayment/bond-repayment.component';

const routes: Routes = [
  {
    path: 'bonds',
    component: BondListComponent,
  },
  {
    path: 'bonds/create',
    component: BondWrapCreateComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full'
      },
      {
        path: 'info',
        component: BondNewComponent
      },
      {
        path: 'schedule',
        component: BondScheduleComponent
      }
    ]
  },
  {
    path: 'bonds/:id',
    component: BondWrapComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full'
      },
      {
        path: 'info',
        component: BondInfoComponent,
      },
      {
        path: 'schedule',
        children: [
          {
            path: '',
            component: BondScheduleComponent
          },
          {
            path: 'repayment',
            component: BondRepaymentComponent
          }
        ]
      },
      {
        path: 'operations',
        component: BondOperationsWrapComponent,
        children: [
          {
            path: '',
            component: BondOperationsComponent
          }
        ]
      },
      {
        path: 'events',
        component: BondEventsComponent
      }
    ]
  },
  {
    path: 'bonds/:id/edit',
    component: BondWrapEditComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full'
      },
      {
        path: 'info',
        component: BondNewComponent,
      },
      {
        path: 'schedule',
        component: BondScheduleComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BondsRoutingModule {
}
