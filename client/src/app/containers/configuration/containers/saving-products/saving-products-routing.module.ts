import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OnEditCanDeactivateGuard } from '../../../../core/guards/on-edit-deactivate-guard.service';
import { SavingProductListComponent } from './saving-product-list/saving-product-list.component';
import { SavingProductCreateComponent } from './saving-product-create/saving-product-create.component';
import { SavingProductInfoComponent } from './saving-product-info/saving-product-info.component';
import { SavingProductEditComponent } from './saving-product-edit/saving-product-edit.component';
import { AuthGuard } from '../../../../core/guards';
import { SavingProductWrapComponent } from './saving-product-wrap/saving-product-wrap.component';
import { SavingProductMakerCheckerComponent } from './saving-product-maker-checker/saving-product-maker-checker.component';

const routes: Routes = [
  {
    path: 'configuration/saving-products',
    component: SavingProductListComponent,
  },
  {
    path: 'saving-products/:id',
    component: SavingProductWrapComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full'
      },
      {
        path: 'info',
        component: SavingProductInfoComponent,
      },
      {
        path: 'maker-checker',
        component: SavingProductMakerCheckerComponent,
      }
    ]
  },
  {
    path: 'configuration/saving-products/create',
    component: SavingProductCreateComponent,
  },
  {
    path: 'configuration/saving-products/:id/edit',
    canDeactivate: [OnEditCanDeactivateGuard],
    component: SavingProductEditComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SavingProductsRoutingModule {
}
