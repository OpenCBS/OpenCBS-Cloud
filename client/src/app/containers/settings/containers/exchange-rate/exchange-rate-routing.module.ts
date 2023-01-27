import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExchangeRateComponent } from './exchange-rate/exchange-rate.component';

const routes: Routes = [
  {
    path: 'settings/exchange-rate',
    component: ExchangeRateComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExchangeRateRoutingModule {
}
