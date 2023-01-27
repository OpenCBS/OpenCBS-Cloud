import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CbsSharedModule } from '../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '../../core/core.module';
import { NglModule } from 'ngx-lightning';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings/settings.component';
import { SettingsWrapComponent } from './settings-wrap/settings-wrap.component';
import { OperationDayModule } from './containers/operation-day/operation-day.module';
import { ExchangeRateModule } from './containers/exchange-rate/exchange-rate.module';
import { AuditTrailModule } from './containers/audit-trail/audit-trail.module';
import { IntegrationWithBankModule } from './containers/integration-with-bank/integration-with-bank.module';
import { PaymentGatewayModule } from './containers/payment-gateway/payment-gateway.module';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    CbsSharedModule,
    TranslateModule,
    NglModule,
    SettingsRoutingModule,
    OperationDayModule,
    ExchangeRateModule,
    AuditTrailModule,
    IntegrationWithBankModule,
    PaymentGatewayModule
  ],
  declarations: [
    SettingsComponent,
    SettingsWrapComponent
  ]
})
export class SettingsModule {
}
