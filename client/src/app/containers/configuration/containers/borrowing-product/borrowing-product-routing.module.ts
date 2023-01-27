import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BorrowingProductListComponent } from './borrowing-product-list/borrowing-product-list.component';
import { BorrowingProductCreateComponent } from './borrowing-product-create/borrowing-product-create.component';
import { BorrowingProductUpdateComponent } from './borrowing-product-update/borrowing-product-update.component';
import { BorrowingProductInfoComponent } from './borrowing-product-info/borrowing-product-info.component';

const routes: Routes = [
  {
    path: 'configuration/borrowing-products',
    component: BorrowingProductListComponent,
  },
  {
    path: 'configuration/borrowing-products/create',
    component: BorrowingProductCreateComponent
  },
  {
    path: 'configuration/borrowing-products/:id/edit',
    component: BorrowingProductUpdateComponent
  },
  {
    path: 'configuration/borrowing-products/:id',
    component: BorrowingProductInfoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BorrowingProductRoutingModule {
}
