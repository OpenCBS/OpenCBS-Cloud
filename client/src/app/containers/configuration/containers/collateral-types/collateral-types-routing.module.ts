import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CollateralTypeListComponent } from './collateral-type-list/collateral-type-list.component';
import { CollateralTypeDetailsComponent } from './collatereral-type-details/collateral-type-details.component';

const routes: Routes = [
  {
    path: 'configuration/collateral-types',
    component: CollateralTypeListComponent
  },
  {
    path: 'configuration/collateral-types/:id',
    component: CollateralTypeDetailsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollateralTypesRoutingModule {
}
