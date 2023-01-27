import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TermDepositProductListComponent } from './term-deposit-product-list/term-deposit-product-list.component';
import { TermDepositProductCreateComponent } from './term-deposit-product-create/term-deposit-product-create.component';
import { TermDepositProductInfoComponent } from './term-deposit-product-info/term-deposit-product-info.component';
import { AuthGuard, OnEditCanDeactivateGuard } from '../../../../core/guards';
import { TermDepositProductWrapComponent } from './term-deposit-product-wrap/term-deposit-product-wrap.component';
import { TermDepositProductMakerCheckerComponent } from './term-deposit-product-maker-checker/term-deposit-product-maker-checker.component';
import { TermDepositProductEditComponent } from './term-deposit-product-edit/term-deposit-product-edit.component';

const routes: Routes = [
  {
    path: 'configuration/term-deposit-products',
    component: TermDepositProductListComponent,
  },
  {
    path: 'term-deposit-products/:id',
    component: TermDepositProductWrapComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full'
      },
      {
        path: 'info',
        component: TermDepositProductInfoComponent,
      },
      {
        path: 'maker-checker',
        component: TermDepositProductMakerCheckerComponent,
      }
    ]
  },
  {
    path: 'configuration/term-deposit-products/create',
    component: TermDepositProductCreateComponent
  },
  {
    path: 'configuration/term-deposit-products/:id/edit',
    canDeactivate: [OnEditCanDeactivateGuard],
    component: TermDepositProductEditComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TermDepositProductRoutingModule { }
