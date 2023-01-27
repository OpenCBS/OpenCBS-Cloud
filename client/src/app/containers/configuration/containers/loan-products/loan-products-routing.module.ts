import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoanProductListComponent } from './loan-product-list/loan-product-list.component';
import { LoanProductCreateComponent } from './loan-product-create/loan-product-create.component';
import { LoanProductInfoComponent } from './loan-product-info/loan-product-info.component';
import { LoanProductEditComponent } from './loan-product-edit/loan-product-edit.component';
import { OnEditCanDeactivateGuard } from '../../../../core/guards/on-edit-deactivate-guard.service';
import { LoanProductWrapComponent } from './loan-product-wrap/loan-product-wrap.component';
import { AuthGuard } from '../../../../core/guards';
import { LoanProductMakerCheckerComponent } from './loan-product-maker-checker/loan-product-maker-checker.component';
import { LoanProductHistoryComponent } from './loan-product-history/loan-product-history.component';

const routes: Routes = [
  {
    path: 'configuration/loan-products',
    component: LoanProductListComponent,
  },
  {
    path: 'loan-products/:id',
    component: LoanProductWrapComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full'
      },
      {
        path: 'info',
        component: LoanProductInfoComponent,
      },
      {
        path: 'history',
        component: LoanProductHistoryComponent,
      },
      {
        path: 'maker-checker',
        component: LoanProductMakerCheckerComponent,
      }
    ]
  },
  {
    path: 'configuration/loan-products/create',
    component: LoanProductCreateComponent,
  },
  {
    path: 'configuration/loan-products/:id/edit',
    canDeactivate: [OnEditCanDeactivateGuard],
    component: LoanProductEditComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanProductsRoutingModule {
}
