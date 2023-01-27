import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth-guard.service';
import { BorrowingWrapCreateComponent } from './borrowing-wrap-create/borrowing-wrap-create.component';
import { BorrowingNewComponent } from './borrowing-new/borrowing-new.component';
import { BorrowingScheduleComponent } from './borrowing-schedule/borrowing-schedule.component';
import { BorrowingWrapComponent } from './borrowing-wrap/borrowing-wrap.component';
import { BorrowingInfoComponent } from './borrowing-info/borrowing-info.component';
import { BorrowingWrapEditComponent } from './borrowing-wrap-edit/borrowing-wrap-edit.component';
import { BorrowingEventsComponent } from './borrowing-events/borrowing-events.component';
import { BorrowingOperationsWrapComponent } from './borrowing-operations/borrowing-operations-wrap.component';
import { BorrowingOperationsComponent } from './borrowing-operations/operations/operations.component';
import { BorrowingRepaymentComponent } from './borrowing-repayment/borrowing-repayment.component';
import { BorrowingListComponent } from './borrowing-list/borrowing-list.component';

const routes: Routes = [
  {
    path: 'borrowings',
    component: BorrowingListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'borrowings/create',
    component: BorrowingWrapCreateComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full'
      },
      {
        path: 'info',
        component: BorrowingNewComponent
      },
      {
        path: 'schedule',
        component: BorrowingScheduleComponent
      }
    ]
  },
  {
    path: 'borrowings/:id',
    component: BorrowingWrapComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full'
      },
      {
        path: 'info',
        component: BorrowingInfoComponent,
      },
      {
        path: 'schedule',
        children: [
          {
            path: '',
            component: BorrowingScheduleComponent
          },
          {
            path: 'repayment',
            component: BorrowingRepaymentComponent
          }
        ]
      },
      {
        path: 'events',
        component: BorrowingEventsComponent
      },
      {
        path: 'operations',
        component: BorrowingOperationsWrapComponent,
        children: [
          {
            path: '',
            component: BorrowingOperationsComponent
          }
        ]
      }
    ]
  },
  {
    path: 'borrowings/:id/edit',
    component: BorrowingWrapEditComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full'
      },
      {
        path: 'info',
        component: BorrowingNewComponent,
      },
      {
        path: 'schedule',
        component: BorrowingScheduleComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BorrowingRoutingModule {
}
