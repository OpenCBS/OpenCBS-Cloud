import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../../../../core/core.module';
import { TranslateModule } from '@ngx-translate/core';

import { PaymentMethodsRoutingModule } from './payment-methods-routing.module';
import { PaymentMethodsComponent } from './payment-methods/payment-methods.component';

@NgModule({
  imports: [
    CommonModule,
    PaymentMethodsRoutingModule,
    CoreModule,
    TranslateModule
  ],
  declarations: [
    PaymentMethodsComponent
  ]
})
export class PaymentMethodsModule {
}
