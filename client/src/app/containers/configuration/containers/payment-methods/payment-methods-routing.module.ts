import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentMethodsComponent } from './payment-methods/payment-methods.component';

const routes: Routes = [
  {
    path: 'configuration/payment-methods',
    component: PaymentMethodsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentMethodsRoutingModule {
}
