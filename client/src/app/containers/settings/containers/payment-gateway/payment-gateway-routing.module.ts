import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentGatewayComponent } from './payment-gateway/payment-gateway.component';

const routes: Routes = [
  {
    path: 'settings/payment-gateway',
    component: PaymentGatewayComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentGatewayRoutingModule {
}
