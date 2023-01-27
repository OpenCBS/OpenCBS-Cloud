import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SavingListComponent } from './saving-list/saving-list.component';
import { AuthGuard } from '../../core/guards/auth-guard.service';
import { SavingWrapCreateComponent } from './saving-wrap-create/saving-wrap-create.component';
import { SavingWrapEditComponent } from './saving-wrap-edit/saving-wrap-edit.component';
import { SavingNewComponent } from './saving-new/saving-new.component';
import { SavingWrapComponent } from './saving-wrap/saving-wrap.component';
import { SavingInfoComponent } from './saving-info/saving-info.component';
import { SavingSpecialOperationsWrapComponent } from './saving-special-operations/special-operations-wrap.component';
import { SavingSpecialOperationComponent } from './saving-special-operations/special-operations/special-operations.component';
import { SavingPrintOutComponent } from './saving-print-out/saving-print-out.component';
import { SavingEntriesComponent } from './saving-entries/saving-entries.component';

const routes: Routes = [
  {
    path: 'savings',
    component: SavingListComponent,
  },
  {
    path: 'savings/create',
    component: SavingWrapCreateComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full'
      },
      {
        path: 'info',
        component: SavingNewComponent
      }
    ]
  },
  {
    path: 'savings/:id',
    component: SavingWrapComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full'
      },
      {
        path: 'info',
        component: SavingInfoComponent,
      },
      {
        path: 'entries',
        component: SavingEntriesComponent
      },
      {
        path: 'operations',
        component: SavingSpecialOperationsWrapComponent,
        canActivateChild: [AuthGuard],
        children: [
          {
            path: '',
            component: SavingSpecialOperationComponent
          }
        ]
      },
      {
        path: 'print-out',
        component: SavingPrintOutComponent
      }
    ]
  },
  {
    path: 'savings/:id/edit',
    component: SavingWrapEditComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full'
      },
      {
        path: 'info',
        component: SavingNewComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SavingsRoutingModule {
}
