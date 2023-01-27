import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OperationDayComponent } from './operation-day/operation-day.component';

const routes: Routes = [
  {
    path: 'settings/operation-day',
    component: OperationDayComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationDayRoutingModule {
}
