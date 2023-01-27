import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountingEntriesComponent } from './accounting-entries/accounting-entries.component';
import { ChartOfAccountsComponent } from './chart-of-accounts/chart-of-accounts.component';
import { RouteGuard } from '../../core/guards/route-guard.service';
import { MakerCheckerAccountsComponent } from './maker-checker-accounts/maker-checker-accounts.component';

const routes: Routes = [
  {
    path: 'accounting/accounting-entries',
    component: AccountingEntriesComponent,
    canActivate: [RouteGuard],
    data: {groupName: 'GENERAL_LEDGER'}
  },
  {
    path: 'accounting/chart-of-accounts',
    component: ChartOfAccountsComponent,
    canActivate: [RouteGuard],
    data: {groupName: 'CHART_OF_ACCOUNTS'}
  },
  {
    path: 'accounting/maker-checker/:id',
    component: MakerCheckerAccountsComponent,
    canActivate: [RouteGuard],
    data: {groupName: 'CHART_OF_ACCOUNTS'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountingRoutingModule {
}
