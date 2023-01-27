import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '../../../../core/core.module';
import { NglModule } from 'ngx-lightning';
import { PaymentGatewayComponent } from './payment-gateway/payment-gateway.component';
import { PaymentGatewayRoutingModule } from './payment-gateway-routing.module';
import { TableModule } from 'primeng/table';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    CoreModule,
    NglModule,
    PaymentGatewayRoutingModule,
    TableModule
  ],
  declarations: [
    PaymentGatewayComponent
  ],
  providers: []
})
export class PaymentGatewayModule {
}
