import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TermDepositListComponent } from './term-deposit-list/term-deposit-list.component';
import { AuthGuard } from '../../core/guards/auth-guard.service';
import { TermDepositWrapCreateComponent } from './term-deposit-wrap-create/term-deposit-wrap-create.component';
import { TermDepositWrapEditComponent } from './term-deposit-wrap-edit/term-deposit-wrap-edit.component';
import { TermDepositNewComponent } from './term-deposit-new/term-deposit-new.component';
import { TermDepositWrapComponent } from './term-deposit-wrap/term-deposit-wrap.component';
import { TermDepositInfoComponent } from './term-deposit-info/term-deposit-info.component';
import { TermDepositSpecialOperationsWrapComponent } from './term-deposit-special-operations/special-operations-wrap.component';
import { TermDepositSpecialOperationComponent } from './term-deposit-special-operations/special-operations/special-operations.component';
import { TermDepositEntriesComponent } from './term-deposit-entries/term-deposit-entries.component';
import { TermDepositAccountTransactionsComponent } from './term-deposit-account-transactions/term-deposit-account-transactions.component';
import { TermDepositPrintOutComponent } from './term-deposit-print-out/term-deposit-print-out.component';

const routes: Routes = [
  {
    path: 'term-deposits',
    component: TermDepositListComponent,
  },
  {
    path: 'term-deposits/create',
    component: TermDepositWrapCreateComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full'
      },
      {
        path: 'info',
        component: TermDepositNewComponent
      }
    ]
  },
  {
    path: 'term-deposits/:id',
    component: TermDepositWrapComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full'
      },
      {
        path: 'info',
        component: TermDepositInfoComponent,
      },
      {
        path: 'entries',
        component: TermDepositEntriesComponent
      },
      {
        path: 'term-deposit-accounts',
        component: TermDepositAccountTransactionsComponent
      },
      {
        path: 'operations',
        component: TermDepositSpecialOperationsWrapComponent,
        canActivateChild: [AuthGuard],
        children: [
          {
            path: '',
            component: TermDepositSpecialOperationComponent
          }
        ]
      },
      {
        path: 'print-out',
        component: TermDepositPrintOutComponent
      }
    ]
  },
  {
    path: 'term-deposits/:id/edit',
    component: TermDepositWrapEditComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full'
      },
      {
        path: 'info',
        component: TermDepositNewComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TermDepositRoutingModule {
}
