import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '../../../../core/core.module';
import { NglModule } from 'ngx-lightning';
import { ExchangeRateComponent } from './exchange-rate/exchange-rate.component';
import { ExchangeRateRoutingModule } from './exchange-rate-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    CoreModule,
    NglModule,
    ExchangeRateRoutingModule
  ],
  declarations: [
    ExchangeRateComponent
  ],
  providers: []
})
export class ExchangeRateModule {
}
