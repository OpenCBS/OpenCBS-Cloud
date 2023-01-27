import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HolidaysListComponent } from './holidays/holidays.component';

const routes: Routes = [
  {
    path: 'configuration/holidays',
    component: HolidaysListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HolidaysRoutingModule {
}
