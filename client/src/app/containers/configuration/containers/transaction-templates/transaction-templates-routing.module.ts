import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../../core/guards';
import { TransactionTemplatesComponent } from './transaction-templates/transaction-templates.component';
import { TransactionTemplatesCreateComponent } from './transaction-templates-create/transaction-templates-create.component';
import { TransactionTemplatesInfoComponent } from './transaction-templates-info/transaction-templates-info.component';
import { TransactionTemplatesEditComponent } from './transaction-templates-edit/transaction-templates-edit.component';

const routes: Routes = [
  {
    path: 'configuration/transaction-templates',
    component: TransactionTemplatesComponent,
    pathMatch: 'full'
  },
  {
    path: 'create/:type',
    component: TransactionTemplatesCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'configuration/transaction-templates/:id',
    component: TransactionTemplatesInfoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'configuration/transaction-templates/:id/edit',
    component: TransactionTemplatesEditComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionTemplatesRoutingModule {
}
