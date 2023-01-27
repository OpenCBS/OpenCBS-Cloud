import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PayeeListComponent } from './payees/payees.component';

const routes: Routes = [
  {
    path: 'configuration/payees',
    component: PayeeListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayeesRoutingModule {
}
